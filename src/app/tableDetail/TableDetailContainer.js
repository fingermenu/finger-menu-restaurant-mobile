// @flow

import React, { Component } from 'react';
import TableDetailView from './TableDetailView';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

class TableDetailContainer extends Component {
  render = () => {
    return <TableDetailView table={this.props.table} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(TableDetailContainer);
