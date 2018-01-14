// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import TablesView from './TablesView';
import { TablesProp } from './PropTypes';
import { HeaderContainer } from '../../components/header';

class TablesContainer extends Component {
  static navigationOptions = {
    headerTitle: <HeaderContainer />,
    // headerStyle: {
    //   backgroundColor: DefaultColor.defaultThemeColor,
    // },
  };
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
      customerName: '',
      reservation: '',
    },
    {
      id: 2,
      name: '2',
      status: 'Empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      reservation: '',
    },
    {
      id: 3,
      name: '3',
      status: 'Taken',
      numberOfAdults: 2,
      numberOfChildren: 0,
      customerName: '',
      reservation: '',
    },
    {
      id: 4,
      name: '4',
      status: 'Empty',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      reservation: '',
    },
    {
      id: 5,
      name: '5',
      status: 'Taken',
      numberOfAdults: 4,
      numberOfChildren: 2,
      customerName: '',
      reservation: '',
    },
    {
      id: 6,
      name: '6',
      status: 'Reserved',
      numberOfAdults: 0,
      numberOfChildren: 0,
      customerName: '',
      reservation: '',
    },
  ];

  return {
    tables: mockTables,
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
