// @flow

import React, { Component } from 'react';
import TableSetupView from './TableSetupView';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import * as AsyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import * as OrdersActions from '../../app/orders/Actions';
import { UpdateTable } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class TableSetupContainer extends Component {
  updateTable = (value, tableStateKey) => {
    UpdateTable.commit(
      Environment,
      this.props.userId,
      this.props.table.id,
      tableStateKey,
      value.numberOfAdults,
      value.numberOfChildren,
      value.name,
      value.notes,
    );
  };

  onSetupTablePressed = value => {
    // this.updateTable(value, 'taken');
    this.props.navigateToAppHome();

    // Save the table into storage
    this.props.AsyncStorageActions.writeValue(Map({ key: 'servingTableId', value: this.props.table.id }));
    this.props.AsyncStorageActions.writeValue(Map({ key: 'servingCustomerName', value: value.name }));
    this.props.AsyncStorageActions.writeValue(Map({ key: 'servingCustomerNotes', value: value.notes }));
    this.props.OrdersActions.setOrder(
      Map({
        restaurantId: this.props.restaurantId,
        tableId: this.props.table.id,
        customerName: value.name,
        notes: value.notes,
        numberOfAdults: value.numberOfAdults,
        numberOfChildren: value.numberOfChildren,
      }),
    );
  };

  onReserveTablePressed = value => {
    this.updateTable(value, 'reserved');
    this.props.goBack();
  };

  render = () => {
    return (
      <TableSetupView table={this.props.table} onSetupTablePressed={this.onSetupTablePressed} onReserveTablePressed={this.onReserveTablePressed} />
    );
  };
}

function mapStateToProps(state, props) {
  return {
    table: props.navigation.state.params.table,
    initialValue: { numberOfAdults: 2 },
    userId: state.userAccess.get('userInfo').get('id'),
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    AsyncStorageActions: bindActionCreators(AsyncStorageActions, dispatch),
    OrdersActions: bindActionCreators(OrdersActions, dispatch),
    navigateToAppHome: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Landing',
            }),
          ],
        }),
      ),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TableSetupContainer));
