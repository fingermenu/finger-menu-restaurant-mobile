// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Range } from 'immutable';
import { DateTimeFormatter } from 'js-joda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import OrdersView from './OrdersView';
import * as ordersActions from './Actions';
import { PlaceOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

const endingDots = '.';
const maxLineLength = 48;
const endOfLine = '\r\n';

class OrdersContainer extends Component {
  static alignTextsOnEachEdge = (leftStr, rightStr, width, padding = ' ') => {
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

  static splitTextIntoMultipleLines = (str, lineLength, prefixStr = '') => {
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

  state = {
    isFetchingTop: false,
  };

  onViewOrderItemPressed = (menuItemPriceId, order, orderItemId) => {
    this.props.navigateToMenuItem(menuItemPriceId, order, orderItemId);
  };

  onConfirmOrderPressed = () => {
    const totalPrice = this.props.tableOrder.get('details').reduce((v, s) => {
      return (
        v +
        s.get('quantity') *
          (s.get('currentPrice') +
            s.get('orderChoiceItemPrices').reduce((ov, os) => {
              return ov + os.get('quantity') * os.getIn(['choiceItemPrice', 'currentPrice']);
            }, 0))
      );
    }, 0);

    const orders = this.props.tableOrder
      .set('totalPrice', totalPrice)
      .set('details', this.props.tableOrder.get('details').valueSeq())
      .update('details', details => details.map(_ => _.delete('menuItem').delete('currentPrice')))
      .update('details', details =>
        details.map(_ => _.update('orderChoiceItemPrices', orderChoiceItemPrices => orderChoiceItemPrices.map(oc => oc.delete('choiceItemPrice')))),
      )
      .toJS();

    const { tableName } = this.props;

    PlaceOrder.commit(Environment, this.props.userId, orders, (placedAt, details) => {
      const { kitchenOrderTemplate } = this.props;
      const orderList = details.reduce((menuItemsDetail, detail) => {
        return (
          menuItemsDetail +
          OrdersContainer.alignTextsOnEachEdge(detail.get('name'), detail.get('quantity').toString(), maxLineLength) +
          endOfLine +
          OrdersContainer.splitTextIntoMultipleLines(detail.get('notes'), maxLineLength, 'Notes: ') +
          detail
            .get('choiceItems')
            .reduce(
              (reduction, choiceItem) =>
                reduction +
                OrdersContainer.alignTextsOnEachEdge('  ' + choiceItem.get('name'), choiceItem.get('quantity').toString(), maxLineLength) +
                endOfLine,
              '',
            )
        );
      }, '');

      if (kitchenOrderTemplate) {
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
              .replace(/{OrderDateTime}/g, placedAt.format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')))
              .replace(/{TableName}/g, tableName)
              .replace(/{OrderList}/g, orderList),
            numberOfCopies: numberOfPrintCopiesForKitchen,
          }),
        );
      }

      this.props.navigateToOrderConfirmed();
    });
  };

  onRemoveOrderPressed = orderItemId => {
    this.props.ordersActions.removeOrderItem(Map({ orderItemId }));
  };

  onRefresh = () => {};

  onEndReached = () => {};

  handleNotesChanged = notes => {
    this.props.ordersActions.changeNotes(notes);
  };

  render = () => {
    const { tableOrder, orders, tableName, customerName, restaurantId } = this.props;

    return (
      <OrdersView
        orders={orders}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onConfirmOrderPressed={this.onConfirmOrderPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        tableName={tableName}
        customerName={customerName}
        restaurantId={restaurantId}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
        notes={tableOrder.get('notes')}
        onNotesChanged={this.handleNotesChanged}
      />
    );
  };
}

OrdersContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenuItem: PropTypes.func.isRequired,
  navigateToOrderConfirmed: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
  kitchenOrderTemplate: PropTypes.string,
  customerName: PropTypes.string,
  numberOfPrintCopiesForKitchen: PropTypes.number,
};

OrdersContainer.defaultProps = {
  kitchenOrderTemplate: null,
  customerName: null,
  numberOfPrintCopiesForKitchen: 1,
};

function mapStateToProps(state) {
  const orders = state.order.getIn(['tableOrder', 'details']).isEmpty()
    ? []
    : state.order
      .getIn(['tableOrder', 'details'])
      .toSeq()
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          orderItemId: key,
        },
      ])
      .toList()
      .toJS();

  const restaurantConfigurations = JSON.parse(state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations']));
  const printerConfig = restaurantConfigurations.printers[0];
  const kitchenOrderTemplate = restaurantConfigurations.documentTemplates.find(
    documentTemplate => documentTemplate.name.localeCompare('KitchenOrder') === 0,
  );

  return {
    orders: orders,
    tableOrder: state.order.get('tableOrder'),
    userId: state.userAccess.get('userInfo').get('id'),
    tableName: state.asyncStorage.getIn(['keyValues', 'servingTableName']),
    customerName: state.asyncStorage.getIn(['keyValues', 'servingCustomerName']),
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
    printerConfig,
    kitchenOrderTemplate: kitchenOrderTemplate ? kitchenOrderTemplate.template : null,
    numberOfPrintCopiesForKitchen: restaurantConfigurations.numberOfPrintCopiesForKitchen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ordersActions: bindActionCreators(ordersActions, dispatch),
    escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
    navigateToMenuItem: (menuItemPriceId, order, orderItemId) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItemPriceId,
            order,
            orderItemId,
          },
        }),
      ),
    navigateToOrderConfirmed: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'OrderConfirmed',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);
