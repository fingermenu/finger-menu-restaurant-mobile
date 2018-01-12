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

  render = () => {
    return (
      <OrderFooterView orderQuantity={this.props.orderQuantity} menuItemId={this.props.menuItem.id} addToOrderPressed={this.onAddMenuItemToOrder} />
    );
  };
}

AddToOrderContainer.propTypes = {
  orderQuantity: PropTypes.number.isRequired,
  menuItem: PropTypes.object.isRequired,
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
