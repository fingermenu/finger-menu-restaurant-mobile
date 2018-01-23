// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import TablesView from './TablesView';
import { TablesProp } from './PropTypes';

class TablesContainer extends Component {
  onTablePressed = table => {
    if (table.status === 'Empty' || table.status === 'Reserved') {
      this.props.navigateToTableSetup(table);
    } else if (table.status === 'Taken') {
      this.props.navigateToTableDetail(table);
    }
  };

  render = () => {
    return <TablesView tables={this.props.tables} onTablePressed={this.onTablePressed} />;
  };
}

TablesContainer.propTypes = {
  tables: TablesProp,
};

function mapStateToProps(state, props) {
  return {
    tables: props.user.restaurant.tables,
  };
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
