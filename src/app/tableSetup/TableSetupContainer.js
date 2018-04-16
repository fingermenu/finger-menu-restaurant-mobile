// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
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
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}-TableSetup` }));
  };

  handleResetTablePressed = () => {
    this.props.googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}-TableSetup-buttonPress`, optionalValues: Map({ label: 'Reset Table', value: 0 }) }),
    );
    this.updateTable({ name: '', notes: '', numberOfAdults: 0, numberOfChildren: 0, lastOrderCorrelationId: '' }, 'empty', {
      onSuccess: () => {
        this.props.googleAnalyticsTrackerActions.trackEvent(
          Map({
            category: 'ui-waiter',
            action: `${eventPrefix}-TableSetup-navigate`,
            optionalValues: Map({ label: 'Going back - Reset Table', value: 0 }),
          }),
        );
        this.props.goBack();
      },
    });
  };

  handleSetupTablePressed = values => {
    this.updateTable(values, 'taken', {
      onSuccess: () => {
        this.props.applicationStateActions.setActiveCustomer(
          Map({
            name: values.name,
            reservationNotes: values.notes,
            numberOfAdults: values.numberOfAdults,
            numberOfChildren: values.numberOfChildren,
          }),
        );
        this.props.applicationStateActions.clearActiveOrder();
        this.props.googleAnalyticsTrackerActions.trackEvent(
          Map({ category: 'ui-waiter', action: `${eventPrefix}-TableSetup-navigate`, optionalValues: Map({ label: 'Landing', value: 0 }) }),
        );
        this.props.navigateToLanding();
      },
    });
  };

  handleReserveTablePressed = value => {
    this.props.googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}-TableSetup-buttonPress`, optionalValues: Map({ label: 'Reserve Table', value: 0 }) }),
    );
    this.updateTable(value, 'reserved', {
      onSuccess: () => {
        this.props.googleAnalyticsTrackerActions.trackEvent(
          Map({
            category: 'ui-waiter',
            action: `${eventPrefix}-TableSetup-navigate`,
            optionalValues: Map({ label: 'Going back - Reserve button', value: 0 }),
          }),
        );
        this.props.goBack();
      },
    });
  };

  updateTable = (values, tableStateKey, callbacks) => {
    UpdateTable(
      Environment,
      {
        id: this.props.table.id,
        tableState: tableStateKey,
        numberOfAdults: values.numberOfAdults,
        numberOfChildren: values.numberOfChildren,
        customerName: values.name,
        notes: values.notes,
        lastOrderCorrelationId: values.lastOrderCorrelationId,
      },
      {},
      {},
      callbacks,
    );
  };

  render = () => (
    <TableSetupView
      table={this.props.table}
      onSetupTablePressed={this.handleSetupTablePressed}
      onReserveTablePressed={this.handleReserveTablePressed}
      onResetTablePressed={this.handleResetTablePressed}
    />
  );
}

TableSetupContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToLanding: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  restaurantId: PropTypes.string.isRequired,
  table: ActiveTableProp.isRequired,
};

function mapStateToProps(state) {
  return {
    table: state.applicationState.get('activeTable').toJS(),
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToLanding: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Landing' })] })),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TableSetupContainer));
