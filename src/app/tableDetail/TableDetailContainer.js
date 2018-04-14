// @flow

import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import TableDetailView from './TableDetailView';
import { TableProp } from './PropTypes';
import { UpdateTable, UpdateOrder } from '../../framework/relay/mutations';
import * as applicationStateActions from '../../framework/applicationState/Actions';

class TableDetailContainer extends Component {
  state = {
    isRefreshing: false,
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

  setActiveCustomer = table => {
    this.props.applicationStateActions.setActiveCustomer(
      Map({
        name: table.customerName,
        reservationNotes: table.notes,
        numberOfAdults: table.numberOfAdults,
        numberOfChildren: table.numberOfChildren,
      }),
    );
  };

  handleResetTablePressed = () => {
    this.setTableStateToEmpty({
      onSuccess: () => {
        this.props.goBack();
      },
    });
  };

  handleSetPaidPressed = () => {
    const {
      user: {
        orders: { edges },
      },
    } = this.props;
    const orders = edges.map(_ => _.node);
    let totalUpdated = 0;

    orders.forEach(order => {
      this.updateOrder(order, null, true, {
        onSuccess: () => {
          totalUpdated = totalUpdated + 1;

          if (orders.length !== totalUpdated) {
            return;
          }

          this.setTableStateToPaid({
            onSuccess: () => {
              this.props.goBack();
            },
          });
        },
      });
    });
  };

  handleSetPaidAndResetPressed = () => {
    const {
      user: {
        orders: { edges },
      },
    } = this.props;
    const orders = edges.map(_ => _.node);
    let totalUpdated = 0;

    orders.forEach(order => {
      this.updateOrder(order, null, true, {
        onSuccess: () => {
          totalUpdated = totalUpdated + 1;

          if (orders.length !== totalUpdated) {
            return;
          }

          this.handleResetTablePressed();
        },
      });
    });
  };

  handleCustomPaidPressed = selectedOrders => {
    const {
      user: {
        orders: { edges },
      },
    } = this.props;
    const allOrders = edges.map(_ => _.node);
    const orders = allOrders.filter(order =>
      order.details.map(_ => _.id).find(id => selectedOrders.find(order => order.get('id').localeCompare(id) === 0)),
    );
    const excludedOrders = allOrders.filter(order => !orders.find(_ => _.id.localeCompare(order.id) === 0));
    let totalUpdated = 0;
    let allPaidFlag = true;

    orders.forEach(order => {
      const allOrdersPaid = this.updateOrder(order, selectedOrders, false, {
        onSuccess: () => {
          totalUpdated = totalUpdated + 1;

          if (!allOrdersPaid) {
            allPaidFlag = false;
          }

          if (orders.length !== totalUpdated) {
            return;
          }

          if (!allPaidFlag || excludedOrders.filter(excludedOrder => excludedOrder.details.find(_ => !_.paid)).length !== 0) {
            return;
          }

          this.setTableStateToPaid({
            onSuccess: () => {
              this.props.goBack();
            },
          });
        },
      });
    });
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

  handleGiveToGuestPressed = () => {
    if (this.props.user.orders.edges.length > 0) {
      const { customerName, numberOfAdults, numberOfChildren, correlationId } = this.props.user.orders.edges[0].node;

      this.props.applicationStateActions.setActiveCustomer(
        Map({
          name: customerName,
          numberOfAdults,
          numberOfChildren,
        }),
      );
      this.props.applicationStateActions.clearActiveOrder();
      this.props.applicationStateActions.setActiveOrderTopInfo(Map({ correlationId }));
      this.props.navigateToHome();
    } else {
      const { table } = this.props;

      this.setActiveCustomer(table);
      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.navigateToTableSetup();
    }
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
              paid:
                setAllMenuItemPricesPaid ||
                detail.get('paid') ||
                !!selectedOrders.find(order => order.get('id').localeCompare(detail.get('id')) === 0),
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

  updateOrder = (orderToUpdate, selectedOrders, setAllMenuItemPricesPaid, callbacks) => {
    const order = Immutable.fromJS(orderToUpdate);
    const orderUpdateRequest = this.convertOrderToOrderRequest(order, selectedOrders, setAllMenuItemPricesPaid);

    UpdateOrder(
      this.props.relay.environment,
      orderUpdateRequest.merge(Map({ restaurantId: this.props.restaurantId, tableId: this.props.table.id })).toJS(),
      order.get('details').map(detail => detail.get('menuItemPrice')),
      order
        .get('details')
        .flatMap(detail => detail.getIn(['orderChoiceItemPrices']))
        .map(orderChoiceItemPrice => orderChoiceItemPrice.get('choiceItemPrice')),
      callbacks,
    );

    return orderUpdateRequest
      .get('details')
      .filterNot(_ => _.get('paid'))
      .isEmpty();
  };

  render = () => {
    const {
      table,
      user: {
        orders: { edges: orders },
      },
    } = this.props;

    return (
      <TableDetailView
        table={table}
        orders={orders.map(_ => _.node)}
        onResetTablePressed={this.handleResetTablePressed}
        onSetPaidPressed={this.handleSetPaidPressed}
        onSetPaidAndResetPressed={this.handleSetPaidAndResetPressed}
        onCustomPaidPressed={this.handleCustomPaidPressed}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
        onGiveToGuestPressed={this.handleGiveToGuestPressed}
      />
    );
  };
}

TableDetailContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToHome: PropTypes.func.isRequired,
  navigateToTableSetup: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  table: TableProp.isRequired,
  tableId: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  const activeTable = state.applicationState.get('activeTable');

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    table: props.user.table,
    tableId: activeTable.get('id'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToHome: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
    navigateToTableSetup: () => dispatch(NavigationActions.navigate({ routeName: 'TableSetup' })),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDetailContainer);
