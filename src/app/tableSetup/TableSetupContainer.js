// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { Map, Range, OrderedMap } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bindActionCreators } from 'redux';
import TableSetupView from './TableSetupView';
import { UpdateTable } from '../../framework/relay/mutations';
import Environment from '../../framework/relay/Environment';
import { DefaultColor } from '../../style';
import { ActiveTableProp } from '../../framework/applicationState';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { eventPrefix, screenNamePrefix } from '../../framework/AnalyticHelper';

class TableSetupContainer extends Component {
  static navigationOptions = {
    headerTitle: 'Setup Table',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  componentDidMount = () => {
    const { googleAnalyticsTrackerActions } = this.props;

    googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}TableSetup` }));
  };

  createCustomerList = (numberOfAdults, numberOfChildren) => {
    const adults = Range(0, numberOfAdults).reduce((reduction, index) => {
      const customerId = cuid();

      return reduction.set(customerId, Map({ customerId, name: `Guest ${index + 1}`, type: 'A' }));
    }, OrderedMap());
    const children = Range(0, numberOfChildren).reduce((reduction, index) => {
      const customerId = cuid();

      return reduction.set(customerId, Map({ customerId, name: `Kid ${index + 1}`, type: 'C' }));
    }, OrderedMap());

    return adults.merge(children);
  };

  handleResetTablePressed = () => {
    const { googleAnalyticsTrackerActions, goBack, applicationStateActions } = this.props;

    googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}TableSetup-buttonPress`, optionalValues: Map({ label: 'Reset Table', value: 0 }) }),
    );
    this.updateTable({ name: '', notes: '', lastOrderCorrelationId: '' }, [], 'empty', {
      onSuccess: () => {
        googleAnalyticsTrackerActions.trackEvent(
          Map({
            category: 'ui-waiter',
            action: `${eventPrefix}TableSetup-navigate`,
            optionalValues: Map({ label: 'Going back - Reset Table', value: 0 }),
          }),
        );
        applicationStateActions.clearActiveCustomers();
        goBack();
      },
    });
  };

  handleSetupTablePressed = values => {
    const { googleAnalyticsTrackerActions, navigateToLanding, applicationStateActions } = this.props;
    const customers = this.createCustomerList(values.numberOfAdults, values.numberOfChildren);

    this.updateTable(values, customers.valueSeq().toJS(), 'taken', {
      onSuccess: () => {
        applicationStateActions.setActiveCustomers(
          Map({
            customers,
            activeCustomerId: customers.keySeq().first(),
            reservationNotes: values.notes,
          }),
        );
        applicationStateActions.clearActiveOrder();
        googleAnalyticsTrackerActions.trackEvent(
          Map({ category: 'ui-waiter', action: `${eventPrefix}TableSetup-navigate`, optionalValues: Map({ label: 'Landing', value: 0 }) }),
        );
        navigateToLanding();
      },
    });
  };

  handleReserveTablePressed = values => {
    const { googleAnalyticsTrackerActions, goBack, applicationStateActions } = this.props;

    googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}TableSetup-buttonPress`, optionalValues: Map({ label: 'Reserve Table', value: 0 }) }),
    );
    const customers = this.createCustomerList(values.numberOfAdults, values.numberOfChildren);

    this.updateTable(values, customers.valueSeq().toJS(), 'reserved', {
      onSuccess: () => {
        googleAnalyticsTrackerActions.trackEvent(
          Map({
            category: 'ui-waiter',
            action: `${eventPrefix}TableSetup-navigate`,
            optionalValues: Map({ label: 'Going back - Reserve button', value: 0 }),
          }),
        );
        applicationStateActions.clearActiveCustomers();
        goBack();
      },
    });
  };

  updateTable = (values, customers, tableStateKey, callbacks) => {
    const {
      table: { id },
    } = this.props;

    UpdateTable(
      Environment,
      {
        id,
        tableState: tableStateKey,
        customers: customers,
        notes: values.notes,
        lastOrderCorrelationId: values.lastOrderCorrelationId,
      },
      {},
      {},
      callbacks,
    );
  };

  render = () => {
    const { table } = this.props;

    return (
      <TableSetupView
        table={table}
        onSetupTablePressed={this.handleSetupTablePressed}
        onReserveTablePressed={this.handleReserveTablePressed}
        onResetTablePressed={this.handleResetTablePressed}
      />
    );
  };
}

TableSetupContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToLanding: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  restaurantId: PropTypes.string.isRequired,
  table: ActiveTableProp.isRequired,
};

const mapStateToProps = state => ({
  table: state.applicationState.get('activeTable').toJS(),
  restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  navigateToLanding: () => dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Landing' })] })),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(TableSetupContainer));
