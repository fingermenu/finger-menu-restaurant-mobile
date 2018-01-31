// @flow

import React, { Component } from 'react';
import TableSetupView from './TableSetupView';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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
    this.updateTable(value, 'taken');
    this.props.navigateToAppHome(this.props.table.id);
    // TODO: Save table id into state.
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
  const mockTable = {
    id: 1,
    name: '1',
    status: 'Empty',
    numberOfAdults: 0,
    numberOfChildren: 0,
  };

  return {
    table: props.navigation.state.params && props.navigation.state.params.table ? props.navigation.state.params.table : mockTable,
    initialValue: { numberOfAdults: 2 },
    userId: state.userAccess.get('userInfo').get('id'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
