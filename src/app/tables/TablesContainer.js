// @flow

import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import Immutable, { Map } from 'immutable';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import TablesView from './TablesView';
import * as applicationStateActions from '../../framework/applicationState/Actions';

class TablesContainer extends Component {
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => ({ restaurant: _.restaurantId }));

      return {
        selectedLanguage: nextProps.selectedLanguage,
      };
    }

    return null;
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isRefreshing: false,
      selectedLanguage: props.selectedLanguage, // eslint-disable-line react/no-unused-state
    };
  }

  componentDidMount = () => {
    const { user: { restaurant: { id, pin, configurations } } } = this.props;

    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
    this.props.applicationStateActions.setActiveRestaurant(Map({ id, pin, configurations: Immutable.fromJS(configurations) }));
  };

  onTablePressed = table => {
    if (!table.tableState || table.tableState.key === 'empty' || table.tableState.key === 'reserved') {
      if (table.tableState.key === 'reserved') {
        this.setActiveCustomer(table);
      } else {
        this.props.applicationStateActions.clearActiveCustomer();
      }

      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.navigateToTableSetup();
    } else if (table.tableState.key === 'taken' || table.tableState.key === 'paid') {
      this.setActiveCustomer(table);
      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.navigateToTableDetail(table);
    }
  };

  setActiveCustomer = table => {
    this.props.applicationStateActions.setActiveCustomer(
      Map({
        name: table.customerName,
        reservationNotes: table.notes,
        numberOfAdults: table.numberOfAdults,
        numberOfChildren: table.numberOfChildren,
      }),
    );
  };

  handleRefresh = () => {
    if (this.state.isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    this.props.relay.refetch(_ => ({ restaurant: _.restaurantId }), null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  handleEndReached = () => true;

  render = () => {
    return (
      <TablesView
        tables={this.props.user.tables.edges.map(_ => _.node).sort((node1, node2) => int(node1.sortOrderIndex).cmp(node2.sortOrderIndex))}
        onTablePressed={this.onTablePressed}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
      />
    );
  };
}

TablesContainer.propTypes = {
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTableSetup: PropTypes.func.isRequired,
  navigateToTableDetail: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToTableSetup: () => dispatch(NavigationActions.navigate({ routeName: 'TableSetup' })),
    navigateToTableDetail: () => dispatch(NavigationActions.navigate({ routeName: 'TableDetail' })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablesContainer);
