// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
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
import { eventPrefix } from '../../framework/AnalyticHelper';

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
    const {
      user: {
        restaurant: { id, pin, configurations },
      },
    } = this.props;

    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
    this.props.applicationStateActions.setActiveRestaurant(Map({ id, pin, configurations: Immutable.fromJS(configurations) }));
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

  handleTablePressed = table => {
    if (!table.tableState || table.tableState.key === 'empty' || table.tableState.key === 'reserved') {
      if (table.tableState.key === 'reserved') {
        this.setActiveCustomer(table);
      } else {
        this.props.applicationStateActions.clearActiveCustomer();
      }

      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.googleAnalyticsTrackerActions.trackEvent(
        Map({ category: 'ui-waiter', action: `${eventPrefix}Tables-navigate`, optionalValues: Map({ label: 'Table Setup', value: 0 }) }),
      );
      this.props.navigateToTableSetup();
    } else if (table.tableState.key === 'taken' || table.tableState.key === 'paid') {
      this.setActiveCustomer(table);
      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.googleAnalyticsTrackerActions.trackEvent(
        Map({ category: 'ui-waiter', action: `${eventPrefix}Tables-navigate`, optionalValues: Map({ label: 'Table Detail', value: 0 }) }),
      );
      this.props.navigateToTableDetail(table);
    }
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

  render = () => (
    <TablesView
      tables={this.props.user.tables.edges.map(_ => _.node).sort((node1, node2) => int(node1.sortOrderIndex).cmp(node2.sortOrderIndex))}
      onTablePressed={this.handleTablePressed}
      isRefreshing={this.state.isRefreshing}
      onRefresh={this.handleRefresh}
      onEndReached={this.handleEndReached}
    />
  );
}

TablesContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTableSetup: PropTypes.func.isRequired,
  navigateToTableDetail: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedLanguage: state.applicationState.get('selectedLanguage'),
});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  navigateToTableSetup: () => dispatch(NavigationActions.navigate({ routeName: 'TableSetup' })),
  navigateToTableDetail: () => dispatch(NavigationActions.navigate({ routeName: 'TableDetail' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(TablesContainer);
