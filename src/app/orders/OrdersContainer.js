// @flow

import React, { Component } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import OrdersView from './OrdersView';
import PropTypes from 'prop-types';
import * as OrdersActions from './Actions';
import { PlaceOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class OrdersContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  onViewOrderItemPressed = (menuItemPriceId, order) => {
    this.props.navigateToMenuItem(menuItemPriceId, order);
  };

  onConfirmOrderPressed = () => {
    PlaceOrder.commit(
      Environment,
      this.props.userId,
      this.props.tableOrder
        .set('details', this.props.tableOrder.get('details').valueSeq())
        .update('details', detail => detail.map(_ => _.delete('menuItem')))
        .toJS(),
    );

    this.props.navigateToOrderConfirmed();
  };

  onRemoveOrderPressed = orderItemId => {
    this.props.ordersActions.removeOrderItem(Map({ orderItemId: orderItemId }));
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
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  OrdersActions: PropTypes.object.isRequired,
  navigateToMenuItem: PropTypes.func.isRequired,
  navigateToOrderConfirmed: PropTypes.func.isRequired,
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
    orders: orders,
    tableOrder: state.order.get('tableOrder'),
    userId: state.userAccess.get('userInfo').get('id'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    OrdersActions: bindActionCreators(OrdersActions, dispatch),
    navigateToMenuItem: (menuItemPriceId, order) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItemPriceId,
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
