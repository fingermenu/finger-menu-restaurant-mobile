// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import TableDetailView from './TableDetailView';
import { TableProp } from './PropTypes';
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
    const { table, order } = this.props;

    return (
      <TableDetailView
        table={table}
        order={order}
        onViewOrderItemPressed={this.onViewOrderItemPressed}
        onRemoveOrderPressed={this.onRemoveOrderPressed}
        onResetTablePressed={this.onResetTablePressed}
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
