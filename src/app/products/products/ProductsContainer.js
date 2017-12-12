// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import * as productsActions from './Actions';
import { AddItemsToShoppingList } from '../../../framework/relay/mutations';
import ProductList from './ProductList';
import { type ProductsRelayContainer_user } from './__generated__/ProductsRelayContainer_user.graphql';

type Props = {
  user: ProductsRelayContainer_user,
};

type State = {
  isFetchingTop: boolean,
};

class ProductsContainer extends Component<any, Props, State> {
  state = {
    isFetchingTop: false,
  };

  onProductItemSelectionChanged = product => {
    const productId = product.id;

    AddItemsToShoppingList.commit(this.props.relay.environment, this.props.user.id, this.props.defaultShoppingListId, {
      productPrices: [Immutable.fromJS(this.props.user.products.edges.map(_ => _.node).find(_ => _.id === productId))],
    });
  };

  onViewProductDetailPressed = (productId, productName) => {
    this.props.gotoProductDetail(productId, productName);
  };

  onRefresh = () => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    });

    this.props.relay.refetchConnection(this.props.user.products.edges.length, () => {
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
      <ProductList
        products={this.props.user.products.edges.map(_ => _.node)}
        onItemSelectionChanged={this.onProductItemSelectionChanged}
        onViewProductDetailPressed={this.onViewProductDetailPressed}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
      />
    );
  };
}

ProductsContainer.propTypes = {
  gotoProductDetail: PropTypes.func.isRequired,
  defaultShoppingListId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    defaultShoppingListId: state.localState.getIn(['defaultShoppingList', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    productsActions: bindActionCreators(productsActions, dispatch),
    gotoProductDetail: (productId, productName) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ProductDetail',
          params: {
            title: productName,
            productId,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsContainer);
