// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable, { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import OrdersView from './OrdersView';
import { PlaceOrder } from '../../framework/relay/mutations';
import { OrderProp } from './PropTypes';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { ActiveCustomerProp } from '../../framework/applicationState';
import { eventPrefix } from '../../framework/AnalyticHelper';
import PrinterHelper from '../../framework/PrintHelper';

class OrdersContainer extends Component {
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

  handleViewOrderItemPressed = ({ groupId, servingTimeId, menuItemPrice: { id: menuItemPriceId } }) => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
    this.props.applicationStateActions.setActiveOrderMenuItemPrice(Map({ groupId, menuItemPriceId, servingTimeId }));
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
          this.props.googleAnalyticsTrackerActions.trackEvent(Map({ category: 'ui-customer', action: `${eventPrefix}Orders-orderPlaced` }));
          navigateToOrderConfirmed();
        },
      },
    );
  };

  handleRemoveOrderPressed = ({ groupId }) => {
    this.props.applicationStateActions.removeItemsFromActiveOrder(Map({ groupId }));
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

    const {
      printerConfig: { hostname, port },
      numberOfPrintCopiesForKitchen,
    } = this.props;

    this.props.escPosPrinterActions.printDocument(
      Map({
        hostname,
        port,
        documentContent: PrinterHelper.convertOrderIntoPrintableDocumentForKitchen(
          details,
          placedAt,
          notes,
          customerName,
          tableName,
          kitchenOrderTemplate,
        ),
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

    const groupedDetails = Immutable.fromJS(inMemoryOrder)
      .get('details')
      .groupBy(item => item.get('groupId'));

    return (
      <OrdersView
        orders={orders.map(_ => _.node)}
        inMemoryOrderItems={groupedDetails
          .keySeq()
          .map(key => {
            const details = groupedDetails.get(key);

            return details.first().set('quantity', details.count());
          })
          .toJS()}
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

const mapStateToProps = (state, ownProps) => {
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
};

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  navigateToMenuItem: () => dispatch(NavigationActions.navigate({ routeName: 'MenuItem' })),
  navigateToOrderConfirmed: () =>
    dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'OrderConfirmed' })] })),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);
