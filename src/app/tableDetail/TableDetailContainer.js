// @flow

import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import TableDetailView from './TableDetailView';
import { TableProp } from './PropTypes';
import { UpdateTable, UpdateOrder } from '../../framework/relay/mutations';

class TableDetailContainer extends Component {
  state = {
    isRefreshing: false,
  };

  onViewOrderItemPressed = () => {
    return true;
  };

  onRemoveOrderPressed = () => {
    return true;
  };

  onResetTablePressed = () => {
    this.setTableStateToEmpty({
      onSuccess: () => {
        this.props.goBack();
      },
    });
  };

  onSetPaidPressed = () => {
    this.updateOrder(null, true, {
      onSuccess: () => {
        this.setTableStateToPaid({
          onSuccess: () => {
            this.props.goBack();
          },
        });
      },
    });
  };

  onCustomPaidPressed = selectedOrders => {
    // If all orders have been paid
    const allOrdersPaid = this.updateOrder(selectedOrders, false, {
      onSuccess: () => {
        if (allOrdersPaid) {
          this.setTableStateToPaid({
            onSuccess: () => {
              this.props.goBack();
            },
          });
        }
      },
    });
  };

  setTableStateToEmpty = callbacks => {
    UpdateTable(
      this.props.relay.environment,
      {
        id: this.props.table.id,
        tableState: 'empty',
        numberOfAdults: 0,
        numberOfChildren: 0,
        customerName: '',
        notes: '',
        lastOrderCorrelationId: '',
      },
      {},
      {
        user: this.props.user,
      },
      callbacks,
    );
  };

  setTableStateToPaid = callbacks => {
    UpdateTable(
      this.props.relay.environment,
      {
        id: this.props.table.id,
        tableState: 'paid',
        numberOfAdults: 0,
        numberOfChildren: 0,
        customerName: '',
        notes: '',
      },
      {},
      {
        user: this.props.user,
      },
      callbacks,
    );
  };

  updateOrder = (selectedOrders, setAllMenuItemPricesPaid, callbacks) => {
    const order = Immutable.fromJS(this.props.order);
    const orderUpdateRequest = this.convertOrderToOrderRequest(order, selectedOrders, setAllMenuItemPricesPaid);
    const { restaurantId, tableId, lastOrderCorrelationId } = this.props;

    UpdateOrder(
      this.props.relay.environment,
      orderUpdateRequest.merge(Map({ restaurantId: this.props.restaurantId, tableId: this.props.table.id })).toJS(),
      order.get('details').map(detail => detail.get('menuItemPrice')),
      order
        .get('details')
        .flatMap(detail => detail.getIn(['orderChoiceItemPrices']))
        .map(orderChoiceItemPrice => orderChoiceItemPrice.get('choiceItemPrice')),
      {
        tableId,
        correlationId: lastOrderCorrelationId,
        restaurantId,
        sortOption: 'PlacedAtDescending',
      },
      {
        user: this.props.user,
      },
      callbacks,
    );

    return orderUpdateRequest
      .get('details')
      .filterNot(_ => _.get('paid'))
      .isEmpty();
  };

  handleRefresh = () => {
    if (this.state.isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    this.props.relay.refetch(
      _ => ({
        restaurant: _.restaurantId,
        tableId: _.tableId,
        lastOrderCorrelationId: _.lastOrderCorrelationId,
        tableIdForTableQuery: _.tableIdForTableQuery,
      }),
      null,
      () => {
        this.setState({ isRefreshing: false });
      },
    );
  };

  handleEndReached = () => true;

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
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
      />
    );
  };
}

TableDetailContainer.propTypes = {
  goBack: PropTypes.func.isRequired,
  table: TableProp.isRequired,
  tableId: PropTypes.string.isRequired,
  lastOrderCorrelationId: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  const activeTable = state.applicationState.get('activeTable');

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    order: props.user.orders.edges.length > 0 ? props.user.orders.edges[0].node : null,
    table: props.user.table,
    tableId: activeTable.get('id'),
    lastOrderCorrelationId: activeTable.get('lastOrderCorrelationId'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDetailContainer);
