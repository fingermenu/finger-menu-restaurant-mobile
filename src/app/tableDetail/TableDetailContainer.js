// @flow

import React, { Component } from 'react';
import TableDetailView from './TableDetailView';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { TableProp } from '../tables/PropTypes';
import { UpdateTable } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';

class TableDetailContainer extends Component {
  onViewOrderItemPressed = () => {
    return true;
  };

  onRemoveOrderPressed = () => {
    return true;
  };

  onResetTablePressed = () => {
    UpdateTable.commit(Environment, this.props.userId, this.props.table.id, 'empty', 0, 0, '', '');
    this.props.goBack();
  };

  render = () => {
    return (
      <TableDetailView
        table={this.props.table}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        onResetTablePressed={this.onResetTablePressed}
      />
    );
  };
}

TableDetailContainer.propTypes = {
  table: TableProp,
};

function mapStateToProps(state, props) {
  return {
    userId: state.userAccess.get('userInfo').get('id'),
    table: props.navigation.state.params.table,
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
