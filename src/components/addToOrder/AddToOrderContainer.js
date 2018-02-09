// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderFooterView from './AddToOrderView';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as OrdersActions from '../../app/orders/Actions';
import { NavigationActions } from 'react-navigation';
import { MenuItemPriceProp } from '../../app/menuItem/PropTypes';
import { OrderItemProp } from '../../app/orders/PropTypes';

class AddToOrderContainer extends Component {
  getSelectedChoiceItemPrices = choiceItems => {
    let choiceItemPriceList = List();

    for (let itemId in choiceItems) {
      if (choiceItems[itemId]) {
        choiceItemPriceList = choiceItemPriceList.push(
          Map({
            choiceItemPriceId: itemId,
            choiceItemPrice: this.props.menuItemPrice.choiceItemPrices.filter(c => c.id === itemId)[0],
            quantity: 1,
          }),
        );
      }
    }

    return choiceItemPriceList;
  };

  onAddMenuItemToOrder = choiceItems => {
    this.props.OrdersActions.addOrderItem(
      Map({
        menuItemPriceId: this.props.menuItemPrice.id,
        menuItem: this.props.menuItemPrice.menuItem,
        quantity: this.props.orderQuantity,
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(choiceItems),
      }),
    );
    this.props.goBack();
  };

  onUpdateOrder = choiceItems => {
    if (this.props.orderItemId) {
      this.props.OrdersActions.updateOrderItem(
        Map({
          orderItemId: this.props.orderItemId,
          menuItemPriceId: this.props.menuItemPrice.id,
          menuItem: this.props.menuItemPrice.menuItem,
          quantity: this.props.orderQuantity,
          orderChoiceItemPrices: this.getSelectedChoiceItemPrices(choiceItems),
        }),
      );
    }

    this.props.goBack();
  };

  render = () => {
    return (
      <OrderFooterView
        isUpdatingOrder={this.props.orderItemId !== null}
        orderQuantity={this.props.orderQuantity}
        addToOrderPressed={this.onAddMenuItemToOrder}
        updateOrderPressed={this.onUpdateOrder}
        handleSubmit={this.props.handleSubmit}
      />
    );
  };
}

AddToOrderContainer.propTypes = {
  orderQuantity: PropTypes.number.isRequired,
  menuItemPrice: MenuItemPriceProp,
  restaurantId: PropTypes.string.isRequired,
  tableId: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  customerNotes: PropTypes.string.isRequired,
  order: OrderItemProp,
  OrdersActions: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    orderItemId: props.orderItemId,
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
    tableId: state.asyncStorage.getIn(['keyValues', 'servingTableId']),
    customerName: state.asyncStorage.getIn(['keyValues', 'servingCustomerName']),
    customerNotes: state.asyncStorage.getIn(['keyValues', 'servingCustomerNotes']),
    handleSubmit: props.handleSubmit,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
    OrdersActions: bindActionCreators(OrdersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToOrderContainer);
