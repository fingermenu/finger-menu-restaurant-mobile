// @flow

import React, { Component } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import OrdersView from './OrdersView';
import * as OrdersActions from './Actions';
import { PlaceOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class OrdersContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  onViewOrderItemPressed = (menuItemPriceId, order, orderItemId) => {
    this.props.navigateToMenuItem(menuItemPriceId, order, orderItemId);
  };

  onConfirmOrderPressed = () => {
    const totalPrice = this.props.tableOrder.get('details').reduce((v, s) => {
      return (
        v +
        s.get('quantity') *
          (s.get('currentPrice') +
            s.get('orderChoiceItemPrices').reduce((ov, os) => {
              return ov + os.get('quantity') * os.getIn(['choiceItemPrice', 'currentPrice']);
            }, 0))
      );
    }, 0);

    const orders = this.props.tableOrder
      .set('totalPrice', totalPrice)
      .set('details', this.props.tableOrder.get('details').valueSeq())
      .update('details', detail => detail.map(_ => _.delete('menuItem').delete('currentPrice')))
      .update('details', detail => detail.map(_ => _.update('orderChoiceItemPrices', choice => choice.map(oc => oc.delete('choiceItemPrice')))))
      .toJS();

    PlaceOrder.commit(Environment, this.props.userId, orders);

    this.props.navigateToOrderConfirmed();
  };

  onRemoveOrderPressed = orderItemId => {
    this.props.OrdersActions.removeOrderItem(Map({ orderItemId: orderItemId }));
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
        tableName={this.props.tableName}
        customerName={this.props.customerName}
        restaurantId={this.props.restaurantId}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
      />
    );
  };
}

OrdersContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  OrdersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenuItem: PropTypes.func.isRequired,
  navigateToOrderConfirmed: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
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
    tableName: state.asyncStorage.getIn(['keyValues', 'servingTableName']),
    customerName: state.asyncStorage.getIn(['keyValues', 'servingCustomerName']),
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    OrdersActions: bindActionCreators(OrdersActions, dispatch),
    navigateToMenuItem: (menuItemPriceId, order, orderItemId) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItemPriceId,
            order,
            orderItemId,
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
