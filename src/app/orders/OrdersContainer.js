// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable, { Map, Range } from 'immutable';
import { DateTimeFormatter } from 'js-joda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import OrdersView from './OrdersView';
import * as ordersActions from './Actions';
import { PlaceOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';
import { OrderProp } from './PropTypes';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { ActiveTableProp, ActiveCustomerProp } from '../../framework/applicationState';

const endingDots = '.';
const maxLineLength = 48;
const endOfLine = '\r\n';

class OrdersContainer extends Component {
  static alignTextsOnEachEdge = (leftStr, rightStr, width = maxLineLength, padding = ' ') => {
    if (leftStr.length + rightStr.length <= width - 1) {
      return leftStr + Array(width - (leftStr.length + rightStr.length)).join(padding) + rightStr;
    }

    if (rightStr.length > width - 1) {
      throw new Error('Can\'t fit the right text.');
    }

    if (leftStr.length + rightStr.length > width - 1 && rightStr.length > width - endingDots.length) {
      throw new Error('Can\'t fit the right text.');
    }

    return leftStr.substring(0, width - (1 + endingDots.length + rightStr.length)) + endingDots + padding + rightStr;
  };

  static splitTextIntoMultipleLines = (str, prefixStr = '', lineLength = maxLineLength) => {
    if (!str) {
      return '';
    }

    const trimmedStr = str.trim();

    if (trimmedStr.length === 0) {
      return '';
    }

    const finalStr = prefixStr + trimmedStr;

    return Range(0, finalStr.length / lineLength)
      .map(idx => finalStr.substring(idx * lineLength, (idx + 1) * lineLength))
      .reduce((reduction, value) => reduction + value + endOfLine, '');
  };

  static convertOrderToOrderRequest = order =>
    order.update('details', details =>
      details.map(detail => {
        const menuItemPrice = detail.get('menuItemPrice');

        return detail
          .merge(
            Map({
              menuItemPriceId: menuItemPrice.get('id'),
              quantity: detail.get('quantity'),
              notes: detail.get('notes'),
              paid: detail.get('paid'),
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

  static calculateTotalPrice = order =>
    order
      .get('details')
      .reduce(
        (total, menuItemPrice) =>
          total +
          menuItemPrice.getIn(['menuItemPrice', 'quantity']) *
            (menuItemPrice.getIn(['menuItemPrice', 'currentPrice']) +
              menuItemPrice
                .get('orderChoiceItemPrices')
                .reduce(
                  (totalChoiceItemPrice, orderChoiceItemPrice) =>
                    totalChoiceItemPrice +
                    orderChoiceItemPrice.getIn(['choiceItemPrice', 'quantity']) * orderChoiceItemPrice.getIn(['choiceItemPrice', 'currentPrice']),
                  0,
                )),
        0,
      );

  state = {
    isFetchingTop: false,
  };

  onViewOrderItemPressed = (menuItemPriceId, order, id) => {
    this.props.navigateToMenuItem(menuItemPriceId, order, id);
  };

  onConfirmOrderPressed = () => {
    const inMemoryOrder = Immutable.fromJS(this.props.inMemoryOrder);
    const orderRequest = OrdersContainer.convertOrderToOrderRequest(inMemoryOrder);
    const totalPrice = OrdersContainer.calculateTotalPrice(inMemoryOrder);
    const {
      navigateToOrderConfirmed,
      restaurantId,
      customer: { name: customerName, numberOfAdults, numberOfChildren },
      table: { id: tableId },
    } = this.props;

    PlaceOrder.commit(
      Environment,
      this.props.userId,
      orderRequest.merge(Map({ totalPrice, restaurantId, tableId, customerName, numberOfAdults, numberOfChildren })).toJS(),
      response => {
        this.printOrder(response);
        navigateToOrderConfirmed();
      },
    );
  };

  onRemoveOrderPressed = id => {
    this.props.ordersActions.removeOrderItem(Map({ id }));
  };

  onRefresh = () => {};

  onEndReached = () => {};

  handleNotesChanged = notes => {
    this.props.applicationStateActions.setActiveOrderTopInfo(Map({ notes }));
  };

  printOrder = response => {
    if (!kitchenOrderTemplate) {
      return;
    }

    const { kitchenOrderTemplate, table: { name: tableName } } = this.props;
    const orderList = response
      .get('details')
      .reduce(
        (menuItemsDetail, detail) =>
          menuItemsDetail +
          OrdersContainer.alignTextsOnEachEdge(detail.get('name'), detail.get('quantity').toString()) +
          endOfLine +
          detail
            .get('choiceItems')
            .reduce(
              (reduction, choiceItem) =>
                reduction + OrdersContainer.alignTextsOnEachEdge('  ' + choiceItem.get('name'), choiceItem.get('quantity').toString()) + endOfLine,
              '',
            ) +
          OrdersContainer.splitTextIntoMultipleLines(detail.get('notes'), 'Notes: '),
        '',
      );

    const { printerConfig: { hostname, port }, numberOfPrintCopiesForKitchen } = this.props;

    this.props.escPosPrinterActions.printDocument(
      Map({
        hostname,
        port,
        documentContent: kitchenOrderTemplate
          .replace('\r', '')
          .replace('\n', '')
          .replace(/{CR}/g, '\r')
          .replace(/{LF}/g, '\n')
          .replace(/{OrderDateTime}/g, response.get('placedAt').format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')))
          .replace(/{Notes}/g, OrdersContainer.splitTextIntoMultipleLines(response.get('notes'), 'Notes: '))
          .replace(/{CustomerName}/g, OrdersContainer.splitTextIntoMultipleLines(response.get('customerName')), 'CustomerName: ')
          .replace(/{TableName}/g, tableName)
          .replace(/{OrderList}/g, orderList),
        numberOfCopies: numberOfPrintCopiesForKitchen,
      }),
    );
  };

  render = () => {
    const { inMemoryOrder, table: { name: tableName }, customer: { name: customerName }, restaurantId } = this.props;

    return (
      <OrdersView
        inMemoryOrderItems={inMemoryOrder.details}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onConfirmOrderPressed={this.onConfirmOrderPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        tableName={tableName}
        customerName={customerName}
        notes={inMemoryOrder.notes}
        restaurantId={restaurantId}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
        onNotesChanged={this.handleNotesChanged}
      />
    );
  };
}

OrdersContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  inMemoryOrder: OrderProp.isRequired,
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenuItem: PropTypes.func.isRequired,
  navigateToOrderConfirmed: PropTypes.func.isRequired,
  table: ActiveTableProp.isRequired,
  restaurantId: PropTypes.string.isRequired,
  kitchenOrderTemplate: PropTypes.string,
  customer: ActiveCustomerProp.isRequired,
  numberOfPrintCopiesForKitchen: PropTypes.number,
};

OrdersContainer.defaultProps = {
  kitchenOrderTemplate: null,
  numberOfPrintCopiesForKitchen: 1,
};

function mapStateToProps(state, ownProps) {
  const configurations = state.applicationState.getIn(['activeRestaurant', 'configurations']);
  const printerConfig = configurations
    .get('printers')
    .first()
    .toJS();
  const kitchenOrderTemplate = configurations
    .get('documentTemplates')
    .find(documentTemplate => documentTemplate.get('name').localeCompare('KitchenOrder') === 0);
  const menuItemPrices = ownProps.user.menuItemPrices.edges.map(_ => _.node);
  const choiceItemPrices = ownProps.user.choiceItemPrices.edges.map(_ => _.node);
  const inMemoryOrder = state.applicationState.get('activeOrder').update('details', details =>
    details
      .map(detail => {
        const foundMenuItemPrice = menuItemPrices.find(menuItemPrice => menuItemPrice.id.localeCompare(detail.getIn(['menuItemPrice', 'id'])) === 0);

        return detail
          .setIn(['menuItemPrice', 'currentPrice'], foundMenuItemPrice.currentPrice)
          .mergeIn(
            ['menuItemPrice', 'menuItem'],
            Map({
              name: foundMenuItemPrice ? foundMenuItemPrice.menuItem.name : null,
              imageUrl: foundMenuItemPrice ? foundMenuItemPrice.menuItem.imageUrl : null,
            }),
          )
          .update('orderChoiceItemPrices', orderChoiceItemPrices =>
            orderChoiceItemPrices.map(orderChoiceItemPrice => {
              const foundChoiceItemPrice = choiceItemPrices.find(
                choiceItemPrice => choiceItemPrice.id.localeCompare(orderChoiceItemPrice.getIn(['choiceItemPrice', 'id'])) === 0,
              );

              return orderChoiceItemPrice.setIn(['choiceItemPrice', 'currentPrice'], foundChoiceItemPrice.currentPrice).mergeIn(
                ['choiceItemPrice', 'choiceItem'],
                Map({
                  name: foundChoiceItemPrice ? foundChoiceItemPrice.choiceItem.name : null,
                  imageUrl: foundMenuItemPrice ? foundChoiceItemPrice.choiceItem.imageUrl : null,
                }),
              );
            }),
          );
      })
      .toList(),
  );

  return {
    inMemoryOrder: inMemoryOrder.toJS(),
    tableOrder: state.order.get('tableOrder'),
    userId: state.userAccess.get('userInfo').get('id'),
    table: state.applicationState.get('activeTable').toJS(),
    customer: state.applicationState.get('activeCustomer').toJS(),
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    printerConfig,
    kitchenOrderTemplate: kitchenOrderTemplate ? kitchenOrderTemplate.get('template') : null,
    numberOfPrintCopiesForKitchen: configurations.get('numberOfPrintCopiesForKitchen'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    ordersActions: bindActionCreators(ordersActions, dispatch),
    escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
    navigateToMenuItem: (menuItemPriceId, order, id) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItemPriceId,
            order,
            id,
          },
        }),
      ),
    navigateToOrderConfirmed: () =>
      dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'OrderConfirmed' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);
