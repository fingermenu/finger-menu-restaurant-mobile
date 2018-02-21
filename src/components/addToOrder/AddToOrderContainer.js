// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import OrderFooterView from './AddToOrderView';
import * as ordersActions from '../../app/orders/Actions';
import { MenuItemPriceProp } from '../../app/menuItem/PropTypes';

class AddToOrderContainer extends Component {
  onAddMenuItemToOrder = choiceItems => {
    this.props.ordersActions.addOrderItem(
      Map({
        menuItemPriceId: this.props.menuItemPrice.id,
        currentPrice: this.props.menuItemPrice.currentPrice,
        menuItem: this.props.menuItemPrice.menuItem,
        quantity: this.props.orderQuantity,
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(choiceItems),
      }),
    );
    this.props.goBack();
  };

  onUpdateOrder = choiceItems => {
    if (this.props.orderItemId) {
      this.props.ordersActions.updateOrderItem(
        Map({
          orderItemId: this.props.orderItemId,
          currentPrice: this.props.menuItemPrice.currentPrice,
          menuItemPriceId: this.props.menuItemPrice.id,
          menuItem: this.props.menuItemPrice.menuItem,
          quantity: this.props.orderQuantity,
          orderChoiceItemPrices: this.getSelectedChoiceItemPrices(choiceItems),
        }),
      );
    }

    this.props.goBack();
  };

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
  menuItemPrice: MenuItemPriceProp.isRequired,
  restaurantId: PropTypes.string.isRequired,
  tableId: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  customerNotes: PropTypes.string.isRequired,
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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
    ordersActions: bindActionCreators(ordersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToOrderContainer);
