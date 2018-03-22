// @flow

import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import TableDetailView from './TableDetailView';
import { TableProp } from './PropTypes';
import { UpdateTable, UpdateOrder } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class TableDetailContainer extends Component {
  onViewOrderItemPressed = () => {
    return true;
  };

  onRemoveOrderPressed = () => {
    return true;
  };

  onResetTablePressed = () => {
    UpdateTable.commit(Environment, this.props.userId, {
      id: this.props.table.id,
      tableState: 'empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      notes: '',
      lastOrderCorrelationId: '',
    });

    this.props.goBack();
  };

  onSetPaidPressed = () => {
    UpdateTable.commit(Environment, this.props.userId, {
      id: this.props.table.id,
      tableState: 'paid',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      notes: '',
    });

    //TODO: UpdateOrder:
    this.props.goBack();
  };

  onCustomPaidPressed = selectedOrders => {
    const order = Immutable.fromJS(this.props.order);

    const orderToUpdate = order
      .update('details', details =>
        details.map(_ =>
          _.merge(
            new Map({
              paid: selectedOrders.find(od => od.getIn(['menuItemPrice', 'id']) === _.getIn(['menuItemPrice', 'id'])) !== undefined,
              menuItemPriceId: _.getIn(['menuItemPrice', 'id']),
            }),
          )
            .delete('menuItemPrice')
            .update('orderChoiceItemPrices', orderChoiceItemPrices =>
              orderChoiceItemPrices.map(orderChoiceItemPrice =>
                orderChoiceItemPrice
                  .set('choiceItemPriceId', orderChoiceItemPrice.getIn(['choiceItemPrice', 'id']))
                  .set('quantity', 1)
                  .delete('choiceItemPrice'),
              ),
            ),
        ),
      )
      .set('restaurantId', this.props.restaurantId)
      .set('tableId', this.props.table.id);

    // If all orders have been paid
    if (
      orderToUpdate
        .get('details')
        .filterNot(_ => _.get('paid'))
        .count() === 0
    ) {
      /* UpdateTable.commit(Environment, this.props.userId, {
         *   id: this.props.table.id,
         *   tableState: 'paid',
         *   numberOfAdults: 0,
         *   numberOfChildren: 0,
         *   customerName: '',
         *   notes: '',
         *   lastOrderCorrelationId: '',
         * }); */
    }

    UpdateOrder.commit(Environment, this.props.userId, orderToUpdate.toJS(), () => {});
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
      />
    );
  };
}

TableDetailContainer.propTypes = {
  table: TableProp.isRequired,
};

function mapStateToProps(state, props) {
  return {
    userId: state.userAccess.get('userInfo').get('id'),
    order: props.user.orders.edges.length > 0 ? props.user.orders.edges[0].node : null,
    table: props.user.table,
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToAppHome: tableId =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Landing',
              params: {
                tableId,
              },
            }),
          ],
        }),
      ),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDetailContainer);
