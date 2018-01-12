// @flow

import React, { Component } from 'react';
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

  onViewOrderItemPressed = menuItem => {
    this.props.navigateToMenuItem(menuItem);
  };

  onConfirmOrderPressed = () => {
    this.props.navigateToOrderConfirmed();
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
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
      />
    );
  };
}

OrdersContainer.propTypes = {
  orders: OrdersProp,
  ordersActions: PropTypes.func.isRequired,
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
    navigateToMenuItem: menuItem =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItem,
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
