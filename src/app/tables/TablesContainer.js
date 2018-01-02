// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import TablesView from './TablesView';
import { TablesProp } from './PropTypes';
import { DefaultColor } from '../../style';
import { HeaderContainer } from '../../components/header';

class TablesContainer extends Component {
  static navigationOptions = {
    headerTitle: <HeaderContainer />,
    headerStyle: {
      backgroundColor: DefaultColor.defaultThemeColor,
    },
  };
  onTablePressed = (tableId, tableStatus) => {
    if (tableStatus === 'Empty') {
      this.props.navigateToTableSetup(tableId);
    }
  };

  render = () => {
    return <TablesView tables={this.props.tables} onTablePressed={this.onTablePressed} />;
  };
}

TablesContainer.propTypes = {
  menuItems: TablesProp,
};

function mapStateToProps() {
  const mockTables = [
    {
      id: 1,
      name: '1',
      status: 'Empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
    },
    {
      id: 2,
      name: '2',
      status: 'Empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
    },
    {
      id: 3,
      name: '3',
      status: 'Empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
    },
  ];

  return {
    tables: mockTables,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToTableSetup: tableId =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'TableSetup',
          params: {
            tableId,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablesContainer);
