// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import React, { Component } from 'react';
import { Map } from 'immutable';
import { DateTimeFormatter } from 'js-joda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import OrdersView from './OrdersView';
import * as ordersActions from './Actions';
import { PlaceOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class OrdersContainer extends Component {
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
          'x' +
          detail.get('quantity') +
          '  ' +
          detail.get('name') +
          '\r\n' +
          detail
            .get('choiceItems')
            .reduce((reduction, choiceItem) => reduction + '  x' + choiceItem.get('quantity') + '  ' + choiceItem.get('name') + '\r\n', '')
        );
      }, '');

      if (kitchenOrderTemplate) {
        const { printerConfig: { hostname, port } } = this.props;

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
          }),
        );
      }

      this.props.navigateToOrderConfirmed();
    });
  };

  onRemoveOrderPressed = orderItemId => {
    this.props.ordersActions.removeOrderItem(Map({ orderItemId: orderItemId }));
  };

  onRefresh = () => {
    // if (this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.setState({
    //   isFetchingTop: true,
    // });
    //
    // this.props.relay.refetchConnection(this.props.user.products.edges.length, () => {
    //   this.setState({
    //     isFetchingTop: false,
    //   });
    // });
  };

  onEndReached = () => {
    // if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.props.relay.loadMore(30, () => {});
  };

  render = () => {
    return (
      <OrdersView
        orders={this.props.orders}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onConfirmOrderPressed={this.onConfirmOrderPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        tableName={this.props.tableName}
        customerName={this.props.customerName}
        restaurantId={this.props.restaurantId}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
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
  customerName: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
  kitchenOrderTemplate: PropTypes.string,
};

OrdersContainer.defaultProps = {
  kitchenOrderTemplate: null,
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
