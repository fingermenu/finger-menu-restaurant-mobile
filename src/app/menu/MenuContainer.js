// @flow

import * as AsyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import MenuView from './MenuView';
import * as OrdersActions from '../orders/Actions';

class MenuContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  onViewMenuItemPressed = menuItemPriceId => {
    this.props.navigateToMenuItem(menuItemPriceId);
  };

  // onAddMenuItemToOrder = menuItem => {
  //   const newOrders = Immutable.fromJS(this.props.orders).concat({
  //     id: this.props.orders.length + 1,
  //     menuItemId: menuItem.Id,
  //     menuItem,
  //   });
  //
  //   this.props.ordersActions.menuOrderChanged(Map({ orders: newOrders }));
  // };
  //
  // onRemoveMenuItemFromOrder = menuItemId => {
  //   const orders = Immutable.fromJS(this.props.orders);
  //   const orderToRemoveIndex = orders.findIndex(order => order.get('menuItemId') === menuItemId);
  //   if (orderToRemoveIndex >= 0) {
  //     this.props.ordersActions.menuOrderChanged(Map({ orders: orders.delete(orderToRemoveIndex) }));
  //   }
  // };

  onRefresh = () => {
    // if (this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.setState({
    //   isFetchingTop: true,
    // });
    //
    // this.props.relay.refetchConnection(this.props.user.products.edges.length, () => {
    //   this.setState({
    //     isFetchingTop: false,
    //   });
    // });
  };

  onEndReached = () => {
    // if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.props.relay.loadMore(30, () => {});
  };
  render = () => {
    return (
      <MenuView
        // menuItems={this.props.menuItems}
        menuItemPrices={this.props.user.menuItemPrices.edges.map(_ => _.node)}
        orders={this.props.orders}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
      />
    );
  };
}

MenuContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state) {
  const orders = state.order.getIn(['tableOrder', 'details']).isEmpty()
    ? []
    : state.order
      .getIn(['tableOrder', 'details'])
      .toSeq()
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          orderItemId: key,
        },
      ])
      .toList()
      .toJS();

  return {
    table: state.asyncStorage.getIn(['keyValues', 'servingTable']),
    orders: orders,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    AsyncStorageActions: bindActionCreators(AsyncStorageActions, dispatch),
    ordersActions: bindActionCreators(OrdersActions, dispatch),
    navigateToMenuItem: menuItemPriceId =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItemPriceId,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
