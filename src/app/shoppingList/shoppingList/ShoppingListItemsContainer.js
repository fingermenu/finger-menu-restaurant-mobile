// @flow

import Immutable, { List, Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Maybe } from 'monet';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ShoppingListItems from './ShoppingListItems';
import { RemoveItemsFromShoppingList } from '../../../framework/relay/mutations';
import * as StapleItemsActions from '../../stapleItems/Actions';
import * as ProductsActions from '../../products/products/Actions';
import * as localStateActions from '../../../framework/localState/Actions';
import { type ShoppingListItemsRelayContainer_user } from './__generated__/ShoppingListItemsRelayContainer_user.graphql';

type Props = {
  user: ShoppingListItemsRelayContainer_user,
};

type State = {};

class ShoppingListItemsContainer extends Component<any, Props, State> {
  state = {
    isFetchingTop: false,
  };

  componentWillMount = () => {
    this.props.localStateActions.defaultShoppingListIdChanged(Map({ id: this.props.user.defaultShoppingList.id }));
    this.props.localStateActions.defaultShoppingListNameChanged(Map({ name: this.props.user.defaultShoppingList.name }));
    this.props.localStateActions.defaultShoppingListTotalItemsCountChanged(
      Map({ totalItemsCount: Maybe.Some(this.props.user.defaultShoppingListItems.edges.length) }),
    );
    this.props.localStateActions.defaultShoppingListItemIdsChanged(
      Map({ itemIds: Immutable.fromJS(this.props.user.defaultShoppingListItems.edges.map(_ => _.node.id)) }),
    );
  };

  componentWillReceiveProps = nextProps => {
    this.props.localStateActions.defaultShoppingListTotalItemsCountChanged(
      Map({ totalItemsCount: Maybe.Some(nextProps.user.defaultShoppingListItems.edges.length) }),
    );
    this.props.localStateActions.defaultShoppingListItemIdsChanged(
      Map({ itemIds: Immutable.fromJS(nextProps.user.defaultShoppingListItems.edges.map(_ => _.node.id)) }),
    );
  };

  onShoppingListItemSelectionChanged = shoppingListItem => {
    RemoveItemsFromShoppingList.commit(this.props.relay.environment, this.props.user.id, this.props.defaultShoppingListId, [shoppingListItem.id]);
  };

  onShoppingListAddItemClicked = () => {
    // Clear the selected staple list
    this.props.stapleItemsActions.stapleItemSelectionChanged(Map({ selectedStapleItems: List() }));
    this.props.gotoAddStapleItems(this.props.defaultShoppingListId);
  };

  onViewProductsPressed = id => {
    const foundItem = this.props.user.defaultShoppingListItems.edges.map(_ => _.node).find(item => item.id.localeCompare(id) === 0);

    this.props.gotoProducts(foundItem.name, foundItem.tags ? foundItem.tags.map(_ => _.key) : '');
  };

  onViewProductDetailPressed = (productId, productName) => {
    this.props.gotoProductDetail(productId, productName);
  };

  onRefresh = lengthToRefresh => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    });

    this.props.relay.refetchConnection(lengthToRefresh || this.props.user.defaultShoppingListItems.edges.length, () => {
      this.setState({
        isFetchingTop: false,
      });
    });
  };

  onEndReached = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(30, () => {});
  };

  render = () => {
    return (
      <ShoppingListItems
        shoppingListItems={this.props.user.defaultShoppingListItems.edges.map(_ => _.node)}
        onShoppingListItemSelectionChanged={this.onShoppingListItemSelectionChanged}
        onViewProductsPressed={this.onViewProductsPressed}
        onShoppingListAddItemClicked={this.onShoppingListAddItemClicked}
        onViewProductDetailPressed={this.onViewProductDetailPressed}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
      />
    );
  };
}
ShoppingListItemsContainer.propTypes = {
  gotoAddStapleItems: PropTypes.func.isRequired,
  stapleItemsActions: PropTypes.object.isRequired,
  productsActions: PropTypes.object.isRequired,
  localStateActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    defaultShoppingListId: state.localState.getIn(['defaultShoppingList', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    stapleItemsActions: bindActionCreators(StapleItemsActions, dispatch),
    productsActions: bindActionCreators(ProductsActions, dispatch),
    localStateActions: bindActionCreators(localStateActions, dispatch),
    gotoAddStapleItems: shoppingListId =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'StapleItems',
          params: {
            shoppingListId,
          },
        }),
      ),
    gotoProducts: (defaultSearchKeyword, defaultCategories) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Products',
          params: {
            defaultSearchKeyword,
            defaultCategories,
            defaultStores: [],
          },
        }),
      ),
    gotoProductDetail: (productId, productName) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ProductDetail',
          params: {
            title: productName,
            productId,
            isInShoppingList: true,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListItemsContainer);
