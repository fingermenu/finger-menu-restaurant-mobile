// @flow

import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import TableSetupView from './TableSetupView';
import * as ordersActions from '../../app/orders/Actions';
import { UpdateTable } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';
import { DefaultColor } from '../../style';
import { TableProp } from '../tables/PropTypes';

class TableSetupContainer extends Component {
  static navigationOptions = {
    headerTitle: 'Setup Table',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  onResetTablePressed = () => {
    UpdateTable.commit(Environment, this.props.userId, this.props.table.id, 'empty', 0, 0, '', '');
    this.props.goBack();
  };

  onSetupTablePressed = value => {
    this.updateTable(value, 'taken');
    this.props.navigateToAppHome();

    // Save the table into storage
    this.props.asyncStorageActions.writeValue(Map({ key: 'servingTableId', value: this.props.table.id }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'servingTableName', value: this.props.table.name }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'servingCustomerName', value: value.name }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'servingCustomerNotes', value: value.notes }));
    this.props.ordersActions.setOrder(
      Map({
        restaurantId: this.props.restaurantId,
        tableId: this.props.table.id,
        customerName: value.name,
        totalPrice: 0,
        numberOfAdults: value.numberOfAdults,
        numberOfChildren: value.numberOfChildren,
      }),
    );
  };

  onReserveTablePressed = value => {
    this.updateTable(value, 'reserved');
    this.props.goBack();
  };

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

  render = () => (
    <TableSetupView
      table={this.props.table}
      onSetupTablePressed={this.onSetupTablePressed}
      onReserveTablePressed={this.onReserveTablePressed}
      onResetTablePressed={this.onResetTablePressed}
    />
  );
}

TableSetupContainer.propTypes = {
  table: TableProp.isRequired,
};

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
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    ordersActions: bindActionCreators(ordersActions, dispatch),
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
