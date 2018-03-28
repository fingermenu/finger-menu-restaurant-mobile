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
import { OrderProp } from './PropTypes';

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

  state = {
    isFetchingTop: false,
  };

  onViewOrderItemPressed = (menuItemPriceId, order, id) => {
    this.props.navigateToMenuItem(menuItemPriceId, order, id);
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

    PlaceOrder.commit(Environment, this.props.userId, orders, response => {
      const { kitchenOrderTemplate } = this.props;
      const orderList = response.get('details').reduce((menuItemsDetail, detail) => {
        return (
          menuItemsDetail +
          OrdersContainer.alignTextsOnEachEdge(detail.get('name'), detail.get('quantity').toString()) +
          endOfLine +
          OrdersContainer.splitTextIntoMultipleLines(detail.get('notes'), 'Notes: ') +
          detail
            .get('choiceItems')
            .reduce(
              (reduction, choiceItem) =>
                reduction + OrdersContainer.alignTextsOnEachEdge('  ' + choiceItem.get('name'), choiceItem.get('quantity').toString()) + endOfLine,
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
              .replace(/{OrderDateTime}/g, response.get('placedAt').format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')))
              .replace(/{Notes}/g, OrdersContainer.splitTextIntoMultipleLines(response.get('notes'), 'Notes: '))
              .replace(/{CustomerName}/g, OrdersContainer.splitTextIntoMultipleLines(response.get('customerName')), 'CustomerName: ')
              .replace(/{TableName}/g, tableName)
              .replace(/{OrderList}/g, orderList),
            numberOfCopies: numberOfPrintCopiesForKitchen,
          }),
        );
      }

      this.props.navigateToOrderConfirmed();
    });
  };

  onRemoveOrderPressed = id => {
    this.props.ordersActions.removeOrderItem(Map({ id }));
  };

  onRefresh = () => {};

  onEndReached = () => {};

  handleNotesChanged = notes => {
    this.props.ordersActions.changeNotes(notes);
  };

  render = () => {
    const { inMemoryOrder, tableName, customerName, restaurantId } = this.props;

    return (
      <OrdersView
        inMemoryOrderItems={inMemoryOrder.items}
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
  inMemoryOrder: OrderProp.isRequired,
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
  const inMemoryOrder = state.applicationState.get('activeOrder').update('items', items =>
    items
      .map(item => {
        const foundMenuItemPrice = menuItemPrices.find(menuItemPrice => menuItemPrice.id.localeCompare(item.getIn(['menuItemPrice', 'id'])) === 0);

        return item
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
    tableName: state.applicationState.getIn(['activeTable', 'name']),
    customerName: state.applicationState.getIn(['activeCustomer', 'name']),
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    printerConfig,
    kitchenOrderTemplate: kitchenOrderTemplate ? kitchenOrderTemplate.get('template') : null,
    numberOfPrintCopiesForKitchen: configurations.get('numberOfPrintCopiesForKitchen'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
