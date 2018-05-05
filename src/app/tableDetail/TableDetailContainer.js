// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import cuid from 'cuid';
import Immutable, { List, Map, OrderedMap } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import TableDetailView from './TableDetailView';
import { TableProp } from './PropTypes';
import { UpdateTable, UpdateOrder } from '../../framework/relay/mutations';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import PrinterHelper, { endOfLine } from '../../framework/PrintHelper';

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
        customers: [],
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
        customers: [],
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
    const customers = table.customers
      ? table.customers.redecue(
        (reduction, customer) =>
          reduction.set(
            customer.id,
            Map({
              id: customer.id,
              name: customer.name,
              type: customer.type,
            }),
          ),
        OrderedMap(),
      )
      : OrderedMap();

    this.props.applicationStateActions.setActiveCustomers(
      Map({
        reservationNotes: table.notes,
        customers,
        activeCustomerId: customers.isEmpty() ? null : customers.first().get('id'),
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

  handleSetPaidPressed = discount => {
    const {
      user: {
        orders: { edges },
      },
    } = this.props;
    const orders = edges.map(_ => _.node);
    let totalUpdated = 0;

    orders.forEach(order => {
      this.updateOrder(
        order,
        null,
        true,
        { id: cuid(), discount },
        {
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
        },
      );
    });
  };

  handleSetPaidAndResetPressed = discount => {
    const {
      user: {
        orders: { edges },
      },
    } = this.props;
    const orders = edges.map(_ => _.node);
    let totalUpdated = 0;

    orders.forEach(order => {
      this.updateOrder(
        order,
        null,
        true,
        { id: cuid(), discount },
        {
          onSuccess: () => {
            totalUpdated = totalUpdated + 1;

            if (orders.length !== totalUpdated) {
              return;
            }

            this.handleResetTablePressed();
          },
        },
      );
    });
  };

  handleSplitPaidPressed = (discount, selectedOrders, printCallback) => {
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
    const paymentGroupId = cuid();
    let totalUpdated = 0;
    let allPaidFlag = true;
    let allDetails = List();

    orders.forEach(order => {
      const allOrdersPaid = this.updateOrder(
        order,
        selectedOrders,
        false,
        { id: paymentGroupId, discount },
        {
          onSuccess: response => {
            totalUpdated = totalUpdated + 1;

            if (!allOrdersPaid) {
              allPaidFlag = false;
            }

            allDetails = allDetails.concat(Immutable.fromJS(response.details));

            if (orders.length !== totalUpdated) {
              return;
            }

            if (printCallback) {
              printCallback(
                allDetails.filter(item => selectedOrders.some(selectedOrder => selectedOrder.get('id').localeCompare(item.get('id')) === 0)),
              );
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
        },
      );
    });
  };

  handleSplitPaidAndPrintReceiptPressed = (discount, selectedOrders) => {
    this.handleSplitPaidPressed(discount, selectedOrders, details => {
      const {
        printerConfig: { hostname, port },
        customerReceiptTemplate,
        user: {
          table: { name: tableName },
        },
      } = this.props;
      const documentContent = PrinterHelper.convertOrderIntoPrintableDocumentForReceipt(details, tableName, customerReceiptTemplate);

      this.props.escPosPrinterActions.printDocument(
        Map({
          hostname,
          port,
          documentContent,
          numberOfCopies: 1,
        }),
      );
    });
  };

  handleRefresh = () => {
    if (this.state.isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    this.props.relay.refetch(_ => _, null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  handleGiveToGuestPressed = () => {
    const { table } = this.props;

    this.setActiveCustomer(table);

    if (this.props.user.orders.edges.length > 0) {
      const { correlationId } = this.props.user.orders.edges[0].node;

      this.props.applicationStateActions.clearActiveOrder();
      this.props.applicationStateActions.setActiveOrderTopInfo(Map({ correlationId }));
      this.props.navigateToHome();
    } else {
      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.navigateToTableSetup();
    }
  };

  handleRePrintForKitchen = () => {
    const {
      printerConfig: { hostname, port },
      kitchenOrderTemplate,
      user: {
        table: { name: tableName },
        orders: { edges: orders },
      },
    } = this.props;
    const documentContent = orders
      .map(_ => _.node)
      .map(({ details, placedAt, notes, customerName }) =>
        PrinterHelper.convertOrderIntoPrintableDocumentForKitchen(details, placedAt, notes, customerName, tableName, kitchenOrderTemplate),
      )
      .reduce((documentContent1, documentContent2) => documentContent1 + endOfLine + documentContent2, '');

    this.props.escPosPrinterActions.printDocument(
      Map({
        hostname,
        port,
        documentContent,
        numberOfCopies: 1,
      }),
    );
  };

  handlePrintReceipt = () => {
    const {
      printerConfig: { hostname, port },
      customerReceiptTemplate,
      user: {
        table: { name: tableName },
        orders: { edges: orders },
      },
    } = this.props;

    const details = Immutable.fromJS(orders.map(_ => _.node)).flatMap(order => order.get('details'));
    const documentContent = PrinterHelper.convertOrderIntoPrintableDocumentForReceipt(details, tableName, customerReceiptTemplate);

    this.props.escPosPrinterActions.printDocument(
      Map({
        hostname,
        port,
        documentContent,
        numberOfCopies: 1,
      }),
    );
  };

  handleEndReached = () => true;

  convertOrderToOrderRequest = (order, selectedOrders, setAllMenuItemPricesPaid, { id: paymentGroupId, discount: paymentGroupDiscount }) =>
    order.update('details', details =>
      details.map(detail => {
        const menuItemPrice = detail.get('menuItemPrice');
        let id;
        let discount;

        if (detail.get('paid')) {
          id = detail.getIn(['paymentGroup', 'id']);
          discount = detail.getIn(['paymentGroup', 'discount']);
        } else {
          if (setAllMenuItemPricesPaid) {
            id = paymentGroupId;
            discount = paymentGroupDiscount;
          } else {
            const foundSelectedOrder = selectedOrders.find(order => order.get('id').localeCompare(detail.get('id')) === 0);

            id = foundSelectedOrder ? paymentGroupId : null;
            discount = foundSelectedOrder ? paymentGroupDiscount : null;
          }
        }

        return detail
          .merge(
            Map({
              paymentGroup: Map({
                id,
                discount,
                paidAt: detail.getIn(['paymentGroup', 'paidAt']),
              }),
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

  updateOrder = (orderToUpdate, selectedOrders, setAllMenuItemPricesPaid, paymentGroup, callbacks) => {
    const order = Immutable.fromJS(orderToUpdate);
    const orderUpdateRequest = this.convertOrderToOrderRequest(order, selectedOrders, setAllMenuItemPricesPaid, paymentGroup);

    UpdateOrder(
      this.props.relay.environment,
      orderUpdateRequest.merge(Map({ restaurantId: this.props.restaurantId, tableId: this.props.table.id, paymentGroupId: paymentGroup.id })).toJS(),
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
      printerConfig,
      customerReceiptTemplate,
      kitchenOrderTemplate,
    } = this.props;

    return (
      <TableDetailView
        table={table}
        orders={orders.map(_ => _.node)}
        onResetTablePressed={this.handleResetTablePressed}
        onSetPaidPressed={this.handleSetPaidPressed}
        onSetPaidAndResetPressed={this.handleSetPaidAndResetPressed}
        onSplitPaidPressed={this.handleSplitPaidPressed}
        onSplitPaidAndPrintReceiptPressed={this.handleSplitPaidAndPrintReceiptPressed}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
        onGiveToGuestPressed={this.handleGiveToGuestPressed}
        onRePrintForKitchen={this.handleRePrintForKitchen}
        canPrintKitchenOrder={!!(kitchenOrderTemplate && printerConfig)}
        onPrintReceipt={this.handlePrintReceipt}
        canPrintReceipt={!!(customerReceiptTemplate && printerConfig)}
      />
    );
  };
}

TableDetailContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToHome: PropTypes.func.isRequired,
  navigateToTableSetup: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  table: TableProp.isRequired,
  tableId: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
  kitchenOrderTemplate: PropTypes.string,
  customerReceiptTemplate: PropTypes.string,
};

TableDetailContainer.defaultProps = {
  kitchenOrderTemplate: null,
  customerReceiptTemplate: null,
};

const mapStateToProps = (state, props) => {
  const activeTable = state.applicationState.get('activeTable');
  const configurations = state.applicationState.getIn(['activeRestaurant', 'configurations']);
  const printerConfig = configurations.get('printers').isEmpty()
    ? null
    : configurations
      .get('printers')
      .first()
      .toJS();
  const kitchenOrderTemplate = configurations
    .get('documentTemplates')
    .find(documentTemplate => documentTemplate.get('name').localeCompare('KitchenOrder') === 0);
  const customerReceiptTemplate = configurations
    .get('documentTemplates')
    .find(documentTemplate => documentTemplate.get('name').localeCompare('CustomerReceipt') === 0);

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    table: props.user.table,
    tableId: activeTable.get('id'),
    printerConfig,
    kitchenOrderTemplate: kitchenOrderTemplate ? kitchenOrderTemplate.get('template') : null,
    customerReceiptTemplate: customerReceiptTemplate ? customerReceiptTemplate.get('template') : null,
  };
};

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
  navigateToHome: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
  navigateToTableSetup: () => dispatch(NavigationActions.navigate({ routeName: 'TableSetup' })),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableDetailContainer);
