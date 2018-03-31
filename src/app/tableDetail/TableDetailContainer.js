// @flow

import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import TableDetailView from './TableDetailView';
import { TableProp } from './PropTypes';
import { UpdateTable, UpdateOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class TableDetailContainer extends Component {
  onViewOrderItemPressed = () => {
    return true;
  };

  onRemoveOrderPressed = () => {
    return true;
  };

  onResetTablePressed = () => {
    this.setTableStateToEmpty();
    this.props.goBack();
  };

  onSetPaidPressed = () => {
    this.updateorder(null, true);
    this.setTableStateToPaid();
    this.props.goBack();
  };

  onCustomPaidPressed = selectedOrders => {
    // If all orders have been paid
    if (this.updateOrder(selectedOrders, false)) {
      this.setTableStateToPaid();
    }
  };

  setTableStateToEmpty = () => {
    UpdateTable.commit(Environment, this.props.userId, {
      id: this.props.table.id,
      tableState: 'empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      notes: '',
      lastOrderCorrelationId: '',
    });
  };

  setTableStateToPaid = () => {
    UpdateTable.commit(Environment, this.props.userId, {
      id: this.props.table.id,
      tableState: 'paid',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      notes: '',
    });
  };

  updateOrder = (selectedOrders, setAllMenuItemPricesPaid) => {
    const order = Immutable.fromJS(this.props.order);
    const orderUpdateRequest = this.convertOrderToOrderRequest(order, selectedOrders, setAllMenuItemPricesPaid);

    UpdateOrder.commit(
      Environment,
      this.props.userId,
      orderUpdateRequest.merge(Map({ restaurantId: this.props.restaurantId, tableId: this.props.table.id })).toJS(),
      order.get('details').map(detail => detail.get('menuItemPrice')),
      order
        .get('details')
        .flatMap(detail => detail.getIn(['orderChoiceItemPrices']))
        .map(orderChoiceItemPrice => orderChoiceItemPrice.get('choiceItemPrice')),
    );

    return orderUpdateRequest
      .get('details')
      .filterNot(_ => _.get('paid'))
      .isEmpty();
  };

  convertOrderToOrderRequest = (order, selectedOrders, setAllMenuItemPricesPaid) => {
    return order.update('details', details =>
      details.map(detail => {
        const menuItemPrice = detail.get('menuItemPrice');

        return detail
          .merge(
            Map({
              menuItemPriceId: menuItemPrice.get('id'),
              quantity: detail.get('quantity'),
              notes: detail.get('notes'),
              paid: setAllMenuItemPricesPaid || detail.get('paid') || !!selectedOrders.find(order => order.get('id') === detail.get('id')),
              orderChoiceItemPrices: detail.get('orderChoiceItemPrices').map(orderChoiceItemPrice => {
                const choiceItemPrice = orderChoiceItemPrice.get('choiceItemPrice');

                return orderChoiceItemPrice
                  .merge(
                    Map({
                      choiceItemPriceId: choiceItemPrice.get('id'),
                      quantity: orderChoiceItemPrice.get('quantity'),
                      notes: orderChoiceItemPrice.get('notes'),
                      paid: orderChoiceItemPrice.get('paid'),
                    }),
                  )
                  .delete('choiceItemPrice');
              }),
            }),
          )
          .delete('menuItemPrice');
      }),
    );
  };

  render = () => {
    const { table, order } = this.props;

    return (
      <TableDetailView
        table={table}
        order={order}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        onResetTablePressed={this.onResetTablePressed}
        onSetPaidPressed={this.onSetPaidPressed}
        onCustomPaidPressed={this.onCustomPaidPressed}
      />
    );
  };
}

TableDetailContainer.propTypes = {
  goBack: PropTypes.func.isRequired,
  table: TableProp.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    userId: state.userAccess.get('userInfo').get('id'),
    order: props.user.orders.edges.length > 0 ? props.user.orders.edges[0].node : null,
    table: props.user.table,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDetailContainer);
