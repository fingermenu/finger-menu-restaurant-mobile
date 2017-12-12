// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { Maybe } from 'monet';
import * as shoppingListsActions from './Actions';
import * as shoppingListDetailActions from '../shoppingListDetail/Actions';
import ShoppingListsList from './ShoppingListsList';
import { RemoveShoppingList, SetUserDefaultShoppingList } from '../../../framework/relay/mutations';
import { environment } from '../../../framework/relay';
import * as localStateActions from '../../../framework/localState/Actions';
import { type ShoppingListsRelayContainer_user } from './__generated__/ShoppingListsRelayContainer_user.graphql';

type Props = {
  user: ShoppingListsRelayContainer_user,
};

type State = {};

class ShoppingListsContainer extends Component<any, Props, State> {
  state = {
    isFetchingTop: false,
  };

  setDefaultShoppingList = shoppingList => {
    this.props.localStateActions.defaultShoppingListIdChanged(Map({ id: shoppingList.id }));
    this.props.localStateActions.defaultShoppingListNameChanged(Map({ name: shoppingList.name }));
    this.props.localStateActions.defaultShoppingListTotalItemsCountChanged(Map({ totalItemsCount: Maybe.Some(shoppingList.totalItemsCount) }));
    SetUserDefaultShoppingList.commit(environment, this.props.userId, this.props.defaultShoppingListItemIds, shoppingList.id);
  };

  onShoppingListPressed = shoppingList => {
    this.setDefaultShoppingList(shoppingList);
    this.props.goBack();
  };

  onCreateShoppingListPressed = () => {
    this.props.shoppingListDetailActions.shoppingListNameChanged(
      Map({
        shoppingListName: '',
        shoppingListId: '',
      }),
    );
    this.props.gotoCreateShoppingList();
  };

  onEditShoppingListPressed = (shoppingListId, shoppingListName) => {
    this.props.shoppingListDetailActions.shoppingListNameChanged(
      Map({
        shoppingListName: '',
        shoppingListId: '',
      }),
    );
    this.props.gotoEditShoppingList(shoppingListId, shoppingListName);
  };

  onDeleteShoppingListPressed = shoppingListId => {
    if (this.props.user.shoppingLists.edges.length <= 1) {
      Alert.alert('Info', 'Sorry, you must have at least one shopping list.');
    } else {
      RemoveShoppingList.commit(environment, this.props.userId, shoppingListId);

      if (shoppingListId.localeCompare(this.props.user.defaultShoppingList.id) === 0) {
        const defaultShoppingList = this.props.user.shoppingLists.edges.map(_ => _.node).filter(_ => _.id.localeCompare(shoppingListId) !== 0)[0];

        this.setDefaultShoppingList(defaultShoppingList);
      }
    }
  };

  onRefresh = () => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    });

    this.props.relay.refetchConnection(this.props.user.shoppingLists.edges.length, () => {
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
      <ShoppingListsList
        shoppingLists={this.props.user.shoppingLists.edges.map(_ => _.node)}
        onShoppingListPressed={this.onShoppingListPressed}
        onCreateShoppingListPressed={this.onCreateShoppingListPressed}
        onEditShoppingListPressed={this.onEditShoppingListPressed}
        onDeleteShoppingListPressed={this.onDeleteShoppingListPressed}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
      />
    );
  };
}

ShoppingListsContainer.propTypes = {
  userId: PropTypes.string.isRequired,
  defaultShoppingListItemIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

function mapStateToProps(state) {
  return {
    userId: state.userAccess.getIn(['userInfo', 'id']),
    defaultShoppingListItemIds: state.localState.getIn(['defaultShoppingList', 'itemIds']).toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    shoppingListsActions: bindActionCreators(shoppingListsActions, dispatch),
    shoppingListDetailActions: bindActionCreators(shoppingListDetailActions, dispatch),
    localStateActions: bindActionCreators(localStateActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
    gotoCreateShoppingList: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ShoppingListDetail',
          params: {
            title: 'Create shopping list',
          },
        }),
      ),
    gotoEditShoppingList: (shoppingListId, shoppingListName) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ShoppingListDetail',
          params: {
            shoppingListId,
            shoppingListName,
            title: shoppingListName,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListsContainer);
