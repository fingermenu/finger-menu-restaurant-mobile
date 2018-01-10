// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderFooterView from './AddToOrderView';
import Immutable, { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as OrdersActions from '../../app/orders/Actions';
import { NavigationActions } from 'react-navigation';

class AddToOrderContainer extends Component {
  onAddMenuItemToOrder = () => {
    const menuItemId = this.props.menuItemId;
    const startingOrderId = this.props.orders.length;

    // const o = Array.from(Array(this.props.orderQuantity).keys()).map(function(num) {
    //   return {
    //     id: startingOrderId + num + 1,
    //     menuItemId,
    //   }
    // });
    let orders = [];
    for (let i = 1; i <= this.props.orderQuantity; i++) {
      orders.push({
        id: startingOrderId + i,
        menuItemId,
      });
    }

    const newOrders = this.props.orders.concat(orders);

    this.props.ordersActions.menuOrderChanged(Map({ orders: Immutable.fromJS(newOrders) }));
    this.props.goBack();
  };

  render = () => {
    return (
      <OrderFooterView orderQuantity={this.props.orderQuantity} menuItemId={this.props.menuItemId} addToOrderPressed={this.onAddMenuItemToOrder} />
    );
  };
}

AddToOrderContainer.propTypes = {
  orderQuantity: PropTypes.number.isRequired,
  menuItemId: PropTypes.string.isRequired,
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
