// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderFooterView from './AddToOrderView';
import Immutable, { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as OrdersActions from '../../app/orders/Actions';
import { NavigationActions } from 'react-navigation';
import { MenuItemProp } from '../../app/menuItem/PropTypes';
import { OrderItemProp } from '../../app/orders/PropTypes';

class AddToOrderContainer extends Component {
  onAddMenuItemToOrder = () => {
    const menuItemId = this.props.menuItem.id;
    const startingOrderId = this.props.orders.length;
    //
    // let orders = [];
    // for (let i = 1; i <= this.props.orderQuantity; i++) {
    //   orders.push({
    //     id: startingOrderId + i,
    //     menuItemId,
    //     menuItem: this.props.menuItem,
    //   });
    // }

    // const newOrders = this.props.orders.push({
    //   id: startingOrderId + 1,
    //   menuItemId,
    //   menuItem: this.props.menuItem,
    //   quantity: this.props.orderQuantity,
    // });

    this.props.ordersActions.menuOrderChanged(
      Map({
        orders: Immutable.fromJS(this.props.orders).push({
          id: startingOrderId + 1,
          menuItemId,
          menuItem: this.props.menuItem,
          quantity: this.props.orderQuantity,
        }),
      }),
    );
    this.props.goBack();
  };

  onUpdateOrder = () => {
    if (this.props.order) {
      this.props.order.quantity = this.props.orderQuantity;
      const index = Immutable.fromJS(this.props.orders).findIndex(order => order.get('id') === this.props.order.id);

      if (index >= 0) {
        this.props.ordersActions.menuOrderChanged(
          Map({
            orders: Immutable.fromJS(this.props.orders).set(index, this.props.order),
          }),
        );
      }
    }

    this.props.goBack();
  };

  render = () => {
    return (
      <OrderFooterView
        isUpdatingOrder={this.props.order !== null}
        orderQuantity={this.props.orderQuantity}
        menuItemId={this.props.menuItem.id}
        addToOrderPressed={this.onAddMenuItemToOrder}
        updateOrderPressed={this.onUpdateOrder}
      />
    );
  };
}

AddToOrderContainer.propTypes = {
  orderQuantity: PropTypes.number.isRequired,
  menuItem: MenuItemProp,
  order: OrderItemProp,
  ordersActions: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    orders: state.orders.get('orders').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
    ordersActions: bindActionCreators(OrdersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToOrderContainer);
