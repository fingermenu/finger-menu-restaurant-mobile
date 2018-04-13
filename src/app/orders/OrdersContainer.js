// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable, { Map, Range } from 'immutable';
import { ZonedDateTime, ZoneId, DateTimeFormatter } from 'js-joda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import OrdersView from './OrdersView';
import { PlaceOrder } from '../../framework/relay/mutations';
import { OrderProp } from './PropTypes';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { ActiveCustomerProp } from '../../framework/applicationState';

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

  static splitTextIntoMultipleLines = (str, prefixText = '', trimText = true, lineLength = maxLineLength) => {
    if (!str) {
      return '';
    }

    const trimmedText = str.trim();

    if (trimmedText.length === 0) {
      return '';
    }

    const finalStr = prefixText + (trimText ? trimmedText : str);

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
              servingTimeId: detail.get('servingTimeId'),
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
          menuItemPrice.get('quantity') *
            (menuItemPrice.getIn(['menuItemPrice', 'currentPrice']) +
              menuItemPrice
                .get('orderChoiceItemPrices')
                .reduce(
                  (totalChoiceItemPrice, orderChoiceItemPrice) =>
                    totalChoiceItemPrice + orderChoiceItemPrice.get('quantity') * orderChoiceItemPrice.getIn(['choiceItemPrice', 'currentPrice']),
                  0,
                )),
        0,
      );

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => ({
        restaurant: _.restaurantId,
        tableId: _.tableId,
        choiceItemPriceIds: _.choiceItemPriceIds,
        menuItemPriceIds: _.menuItemPriceIds,
        correlationId: _.correlationId,
      }));

      return {
        selectedLanguage: nextProps.selectedLanguage,
      };
    }

    return null;
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isRefreshing: false,
      selectedLanguage: props.selectedLanguage, // eslint-disable-line react/no-unused-state
    };
  }

  getPrintableOrderDetails = details => {
    const groupedDetails = details.groupBy(detail => {
      const choiceItemPriceIds = detail
        .get('orderChoiceItemPrices')
        .map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id']))
        .sort((id1, id2) => id1.localeCompare(id2))
        .reduce((reduction, id) => reduction + id, '');
      const notes = detail.get('notes') ? detail.get('notes') : '';

      return detail.getIn(['menuItemPrice', 'id']) + notes + choiceItemPriceIds;
    });

    return groupedDetails
      .keySeq()
      .map(key =>
        groupedDetails
          .get(key)
          .reduce(
            (reduction, detail) => (reduction.isEmpty() ? detail : reduction.update('quantity', quantity => quantity + detail.get('quantity'))),
            Map(),
          ),
      )
      .reduce(
        (menuItemsDetail, detail) =>
          menuItemsDetail +
          endOfLine +
          OrdersContainer.alignTextsOnEachEdge(detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrint']), detail.get('quantity').toString()) +
          endOfLine +
          detail
            .get('orderChoiceItemPrices')
            .reduce(
              (reduction, orderChoiceItemPrices) =>
                reduction +
                OrdersContainer.splitTextIntoMultipleLines(
                  '  ' + orderChoiceItemPrices.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrint']),
                  '',
                  false,
                ),
              '',
            ) +
          OrdersContainer.splitTextIntoMultipleLines(detail.get('notes'), 'Notes: '),
        '',
      );
  };

  getPrintableOrderDetailsWithServingTime = (servingTime, details) => {
    const padding = Array(Math.floor((maxLineLength - servingTime.length) / 2 + 1)).join('-');

    return padding + servingTime + padding + endOfLine + endOfLine + this.getPrintableOrderDetails(details) + endOfLine + endOfLine;
  };

  handleViewOrderItemPressed = ({ id, servingTimeId, menuItemPrice: { id: menuItemPriceId } }) => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
    this.props.applicationStateActions.setActiveOrderMenuItemPrice(Map({ id, menuItemPriceId, servingTimeId }));
    this.props.navigateToMenuItem();
  };

  handleConfirmOrderPressed = () => {
    const inMemoryOrder = Immutable.fromJS(this.props.inMemoryOrder);
    const orderRequest = OrdersContainer.convertOrderToOrderRequest(inMemoryOrder);
    const totalPrice = OrdersContainer.calculateTotalPrice(inMemoryOrder);
    const {
      navigateToOrderConfirmed,
      restaurantId,
      customer: { name: customerName, numberOfAdults, numberOfChildren },
      user: {
        table: { id: tableId },
      },
    } = this.props;

    PlaceOrder(
      this.props.relay.environment,
      orderRequest.merge(Map({ totalPrice, restaurantId, tableId, customerName, numberOfAdults, numberOfChildren })).toJS(),
      inMemoryOrder.get('details').map(detail => detail.get('menuItemPrice')),
      inMemoryOrder
        .get('details')
        .flatMap(detail => detail.getIn(['orderChoiceItemPrices']))
        .map(orderChoiceItemPrice => orderChoiceItemPrice.get('choiceItemPrice')),
      {},
      {
        user: this.props.user,
      },
      {
        onSuccess: response => {
          this.printOrder(response);
          this.props.applicationStateActions.clearActiveOrder();
          this.props.applicationStateActions.setActiveOrderTopInfo(Map({ correlationId: response.correlationId }));
          this.props.googleAnalyticsTrackerActions.trackEvent(Map({ category: 'ui-customer', action: 'orderPlaced' }));
          navigateToOrderConfirmed();
        },
      },
    );
  };

  handleRemoveOrderPressed = ({ id }) => {
    this.props.applicationStateActions.removeItemFromActiveOrder(Map({ id }));
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
        choiceItemPriceIds: _.choiceItemPriceIds,
        menuItemPriceIds: _.menuItemPriceIds,
        correlationId: _.correlationId,
      }),
      null,
      () => {
        this.setState({ isRefreshing: false });
      },
    );
  };

  handleEndReached = () => true;

  handleNotesChanged = notes => {
    this.props.applicationStateActions.setActiveOrderTopInfo(Map({ notes }));
  };

  printOrder = ({ details, placedAt, notes, customerName }) => {
    const {
      printerConfig,
      kitchenOrderTemplate,
      user: {
        table: { name: tableName },
      },
    } = this.props;

    if (!kitchenOrderTemplate || !printerConfig) {
      return;
    }

    const immutableDetails = Immutable.fromJS(details);
    const detailsWithUnspecifiedServingTime = immutableDetails.filterNot(detail => !!detail.get('servingTime'));
    const detailsWithServingTimes = immutableDetails.filter(detail => !!detail.get('servingTime'));
    const groupedDetails = detailsWithServingTimes.groupBy(detail => detail.getIn(['servingTime', 'id']));
    let finalOrderList = groupedDetails
      .keySeq()
      .map(servingTimeId =>
        Map({
          servingTimeNameToPrint: groupedDetails
            .get(servingTimeId)
            .first()
            .getIn(['servingTime', 'tag', 'nameToPrint']),
          details: groupedDetails.get(servingTimeId),
        }),
      )
      .map(groupedDetailsWithServingTime =>
        this.getPrintableOrderDetailsWithServingTime(
          groupedDetailsWithServingTime.get('servingTimeNameToPrint'),
          groupedDetailsWithServingTime.get('details'),
        ),
      )
      .reduce((orderList1, orderList2) => orderList1 + endOfLine + orderList2, '');

    if (!detailsWithUnspecifiedServingTime.isEmpty()) {
      finalOrderList = finalOrderList + this.getPrintableOrderDetailsWithServingTime('Unspecified', detailsWithUnspecifiedServingTime);
    }

    const {
      printerConfig: { hostname, port },
      numberOfPrintCopiesForKitchen,
    } = this.props;

    this.props.escPosPrinterActions.printDocument(
      Map({
        hostname,
        port,
        documentContent: kitchenOrderTemplate
          .replace('\r', '')
          .replace('\n', '')
          .replace(/{CR}/g, '\r')
          .replace(/{LF}/g, '\n')
          .replace(
            /{OrderDateTime}/g,
            ZonedDateTime.parse(placedAt)
              .withZoneSameInstant(ZoneId.SYSTEM)
              .format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')),
          )
          .replace(/{Notes}/g, OrdersContainer.splitTextIntoMultipleLines(notes, 'Notes: '))
          .replace(/{CustomerName}/g, OrdersContainer.splitTextIntoMultipleLines(customerName), 'Customer Name: ')
          .replace(/{TableName}/g, tableName)
          .replace(/{OrderList}/g, finalOrderList),
        numberOfCopies: numberOfPrintCopiesForKitchen,
      }),
    );
  };

  render = () => {
    const {
      inMemoryOrder,
      customer: { name: customerName },
      user: {
        orders: { edges: orders },
        restaurant: { menus },
        table: { name: tableName },
      },
    } = this.props;

    return (
      <OrdersView
        orders={orders.map(_ => _.node)}
        inMemoryOrderItems={inMemoryOrder.details}
        onViewOrderItemPressed={this.handleViewOrderItemPressed}
        onConfirmOrderPressed={this.handleConfirmOrderPressed}
        onRemoveOrderPressed={this.handleRemoveOrderPressed}
        tableName={tableName}
        customerName={customerName}
        notes={inMemoryOrder.notes}
        menus={menus}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
        onNotesChanged={this.handleNotesChanged}
      />
    );
  };
}

OrdersContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectedLanguage: PropTypes.string.isRequired,
  inMemoryOrder: OrderProp.isRequired,
  navigateToMenuItem: PropTypes.func.isRequired,
  navigateToOrderConfirmed: PropTypes.func.isRequired,
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
  const printerConfig = configurations.get('printers').isEmpty()
    ? null
    : configurations
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
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    inMemoryOrder: inMemoryOrder.toJS(),
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
    escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
    googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
    navigateToMenuItem: () => dispatch(NavigationActions.navigate({ routeName: 'MenuItem' })),
    navigateToOrderConfirmed: () =>
      dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'OrderConfirmed' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);
