// @flow

import React, { Component } from 'react';
import Immutable, { Map } from 'immutable';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import OrdersView from './OrdersView';
import PropTypes from 'prop-types';
import { OrdersProp } from './PropTypes';
import * as OrdersActions from './Actions';

class OrdersContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  onViewOrderItemPressed = (menuItem, order) => {
    this.props.navigateToMenuItem(menuItem, order);
  };

  onConfirmOrderPressed = () => {
    this.props.navigateToOrderConfirmed();
  };

  onRemoveOrderPressed = orderId => {
    const orders = Immutable.fromJS(this.props.orders);
    const orderToRemoveIndex = orders.findIndex(order => order.get('id') === orderId);
    if (orderToRemoveIndex >= 0) {
      this.props.ordersActions.menuOrderChanged(Map({ orders: orders.delete(orderToRemoveIndex) }));
    }
  };
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
      <OrdersView
        orders={this.props.orders}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onConfirmOrderPressed={this.onConfirmOrderPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
      />
    );
  };
}

OrdersContainer.propTypes = {
  orders: OrdersProp,
  ordersActions: PropTypes.object.isRequired,
  navigateToMenuItem: PropTypes.func.isRequired,
  navigateToOrderConfirmed: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    orders: state.orders.get('orders').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ordersActions: bindActionCreators(OrdersActions, dispatch),
    navigateToMenuItem: (menuItem, order) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItem,
            order,
          },
        }),
      ),
    navigateToOrderConfirmed: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'OrderConfirmed',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);
