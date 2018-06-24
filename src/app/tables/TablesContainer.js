// @flow

import { NotificationType } from '@microbusiness/common-react';
import * as notificationActions from '@microbusiness/common-react/src/notification/Actions';
import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import Immutable, { Map, OrderedMap } from 'immutable';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import TablesView from './TablesView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { eventPrefix } from '../../framework/AnalyticHelper';
import PackageBundleHelper from '../../framework/PackageBundleHelper';

class TablesContainer extends Component {
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
        restaurant: { id, pin, name, configurations, packageBundle },
      },
      installedPackageBundleChecksum,
      asyncStorageActions,
      applicationStateActions,
    } = this.props;

    asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
    applicationStateActions.setActiveRestaurant(Map({ id, pin, name, configurations: Immutable.fromJS(configurations) }));

    if (packageBundle.checksum.localeCompare(installedPackageBundleChecksum) !== 0) {
      this.installLatestPackageBundle(installedPackageBundleChecksum, packageBundle);
    }
  };

  static getDerivedStateFromProps = ({ selectedLanguage, relay }, { selectedLanguage: prevSelectedLanguage }) => {
    if (selectedLanguage.localeCompare(prevSelectedLanguage) !== 0) {
      relay.refetch(_ => _);

      return {
        selectedLanguage,
      };
    }

    return null;
  };

  setActiveCustomers = table => {
    const customers = table.customers.reduce(
      (reduction, customer) =>
        reduction.set(
          customer.customerId,
          Map({
            customerId: customer.customerId,
            name: customer.name,
            type: customer.type,
          }),
        ),
      OrderedMap(),
    );

    const { applicationStateActions } = this.props;

    applicationStateActions.setActiveCustomers(
      Map({
        reservationNotes: table.notes,
        customers,
        activeCustomerId: customers.isEmpty() ? null : customers.first().get('customerId'),
      }),
    );
  };

  installLatestPackageBundle = async (installedPackageBundleChecksum, packageBundle) => {
    const { asyncStorageActions, notificationActions } = this.props;

    try {
      await new PackageBundleHelper(installedPackageBundleChecksum, packageBundle).installPackageBundle();

      asyncStorageActions.writeValue(Map({ key: 'installedPackageBundleChecksum', value: packageBundle.checksum }));
    } catch (ex) {
      notificationActions.add(ex.message, NotificationType.ERROR);
    }
  };

  handleTablePressed = table => {
    const { applicationStateActions, googleAnalyticsTrackerActions, navigateToTableDetail, navigateToTableSetup } = this.props;

    if (!table.tableState || table.tableState.key === 'empty' || table.tableState.key === 'reserved') {
      if (table.tableState.key === 'reserved') {
        this.setActiveCustomers(table);
      } else {
        applicationStateActions.clearActiveCustomers();
      }

      applicationStateActions.setActiveTable(Immutable.fromJS(table));
      googleAnalyticsTrackerActions.trackEvent(
        Map({ category: 'ui-waiter', action: `${eventPrefix}Tables-navigate`, optionalValues: Map({ label: 'Table Setup', value: 0 }) }),
      );
      navigateToTableSetup();
    } else if (table.tableState.key === 'taken' || table.tableState.key === 'paid') {
      this.setActiveCustomers(table);
      applicationStateActions.setActiveTable(Immutable.fromJS(table));
      googleAnalyticsTrackerActions.trackEvent(
        Map({ category: 'ui-waiter', action: `${eventPrefix}Tables-navigate`, optionalValues: Map({ label: 'Table Detail', value: 0 }) }),
      );
      navigateToTableDetail(table);
    }
  };

  handleRefresh = () => {
    const { isRefreshing } = this.state;
    const { relay } = this.props;

    if (isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    relay.refetch(_ => _, null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  handleEndReached = () => true;

  render = () => {
    const {
      user: {
        tables: { edges: tableEdges },
      },
    } = this.props;
    const { isRefreshing } = this.state;

    return (
      <TablesView
        tables={tableEdges.map(_ => _.node).sort((node1, node2) => int(node1.sortOrderIndex).cmp(node2.sortOrderIndex))}
        onTablePressed={this.handleTablePressed}
        isRefreshing={isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
      />
    );
  };
}

TablesContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  notificationActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTableSetup: PropTypes.func.isRequired,
  navigateToTableDetail: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  installedPackageBundleChecksum: PropTypes.string,
};

TablesContainer.defaultProps = {
  installedPackageBundleChecksum: null,
};

const mapStateToProps = state => ({
  selectedLanguage: state.applicationState.get('selectedLanguage'),
  installedPackageBundleChecksum: state.asyncStorage.getIn(['keyValues', 'installedPackageBundleChecksum']),
});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  navigateToTableSetup: () => dispatch(NavigationActions.navigate({ routeName: 'TableSetup' })),
  navigateToTableDetail: () => dispatch(NavigationActions.navigate({ routeName: 'TableDetail' })),
  notificationActions: bindActionCreators(notificationActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TablesContainer);
