// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import int from 'int';
import TablesView from './TablesView';

class TablesContainer extends Component {
  onTablePressed = table => {
    if (!table.tableState || table.tableState.key === 'empty' || table.tableState.key === 'reserved') {
      this.props.navigateToTableSetup(table);
    } else if (table.tableState.key === 'taken' || table.tableState.key === 'paid') {
      this.props.navigateToTableDetail(table);
    }
  };

  render = () => {
    return (
      <TablesView
        tables={this.props.user.tables.edges.map(_ => _.node).sort((node1, node2) => int(node1.sortOrderIndex).cmp(node2.sortOrderIndex))}
        onTablePressed={this.onTablePressed}
      />
    );
  };
}

TablesContainer.propTypes = {
  navigateToTableSetup: PropTypes.func.isRequired,
  navigateToTableDetail: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToTableSetup: table =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'TableSetup',
          params: {
            table,
          },
        }),
      ),
    navigateToTableDetail: table =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'TableDetail',
          params: {
            table,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablesContainer);
