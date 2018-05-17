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
import { CustomersProp } from '../../framework/applicationState';
import { eventPrefix } from '../../framework/AnalyticHelper';
import PrinterHelper from '../../framework/PrintHelper';

class OrdersContainer extends Component {
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => _);

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

  convertOrderToOrderRequest = order =>
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
              customer: this.props.customers.find(_ => _.customerId === detail.getIn(['customer', 'customerId'])),
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

  handleViewOrderItemPressed = ({ groupId, servingTimeId, menuItemPrice: { id: menuItemPriceId } }) => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
    this.props.applicationStateActions.setActiveOrderMenuItemPrice(Map({ groupId, menuItemPriceId, servingTimeId }));
    this.props.navigateToMenuItem();
  };

  handleConfirmOrderPressed = () => {
    const inMemoryOrder = Immutable.fromJS(this.props.inMemoryOrder);
    const orderRequest = this.convertOrderToOrderRequest(inMemoryOrder);
    const {
      navigateToOrderConfirmed,
      restaurantId,
      user: {
        table: { id: tableId },
      },
      customers,
    } = this.props;

    PlaceOrder(
      this.props.relay.environment,
      orderRequest.merge(Map({ customers, restaurantId, tableId })).toJS(),
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

    this.props.relay.refetch(_ => _, null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  handleEndReached = () => true;

  handleNotesChanged = notes => {
    this.props.applicationStateActions.setActiveOrderTopInfo(Map({ notes }));
  };

  printOrder = ({ details, placedAt, notes }) => {
    const {
      printerConfig,
      kitchenOrderTemplate,
      user: {
        table: { name: tableName },
      },
      printOnKitchenReceiptLanguage,
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
        documentContent: PrinterHelper.convertOrderIntoPrintableDocumentForKitchen(details, placedAt, notes, '', tableName, kitchenOrderTemplate),
        numberOfCopies: numberOfPrintCopiesForKitchen,
        language: printOnKitchenReceiptLanguage,
      }),
    );
  };

  render = () => {
    const {
      inMemoryOrder,
      customers,
      user: {
        orders: { edges: orders },
        restaurant: { menus },
        table: { name: tableName },
      },
    } = this.props;

    const groupedOrdersDetails = Immutable.fromJS(orders)
      .flatMap(order => order.getIn(['node', 'details']))
      .groupBy(item => item.get('groupId'));
    const groupedInMemoryOrderDetails = Immutable.fromJS(inMemoryOrder)
      .get('details')
      .groupBy(item => item.get('groupId'));

    return (
      <OrdersView
        orderItems={groupedOrdersDetails
          .keySeq()
          .map(key => {
            const details = groupedOrdersDetails.get(key);

            return details.first().set('quantity', details.count());
          })
          .toJS()}
        inMemoryOrderItems={groupedInMemoryOrderDetails
          .keySeq()
          .map(key => {
            const details = groupedInMemoryOrderDetails.get(key);

            return details.first().set('quantity', details.count());
          })
          .toJS()}
        onViewOrderItemPressed={this.handleViewOrderItemPressed}
        onConfirmOrderPressed={this.handleConfirmOrderPressed}
        onRemoveOrderPressed={this.handleRemoveOrderPressed}
        tableName={tableName}
        notes={inMemoryOrder.notes}
        menus={menus}
        customers={customers}
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
  customers: CustomersProp.isRequired,
  numberOfPrintCopiesForKitchen: PropTypes.number,
  printOnKitchenReceiptLanguage: PropTypes.string,
};

OrdersContainer.defaultProps = {
  kitchenOrderTemplate: null,
  numberOfPrintCopiesForKitchen: 1,
  printOnKitchenReceiptLanguage: null,
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
    customers: state.applicationState
      .getIn(['activeCustomers', 'customers'])
      .valueSeq()
      .toJS(),
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    printerConfig,
    kitchenOrderTemplate: kitchenOrderTemplate ? kitchenOrderTemplate.get('template') : null,
    numberOfPrintCopiesForKitchen: configurations.get('numberOfPrintCopiesForKitchen'),
    printOnKitchenReceiptLanguage: state.applicationState.getIn(['activeRestaurant', 'configurations', 'languages', 'printOnKitchenReceipt']),
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
