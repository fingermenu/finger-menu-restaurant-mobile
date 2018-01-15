// @flow

import React, { Component } from 'react';
import TableSetupView from './TableSetupView';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

class TableSetupContainer extends Component {
  onSetupTablePressed = () => {
    this.props.navigateToAppHome(this.props.table.id);
  };

  render = () => {
    return <TableSetupView table={this.props.table} onSetupTablePressed={this.onSetupTablePressed} />;
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TableSetupContainer));
