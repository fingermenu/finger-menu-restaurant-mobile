// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';

class OfflinePinContainer extends Component {
  handlePinMatched = () => {
    this.props.googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: 'navigate', optionalValues: Map({ label: 'Pin to Tables', value: 0 }) }),
    );
    this.props.navigateToTables();
  };

  render = () => <PinView onPinMatched={this.handlePinMatched} matchingPin={this.props.pin} />;
}

OfflinePinContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTables: PropTypes.func.isRequired,
  pin: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    pin: state.applicationState.getIn(['activeRestaurant', 'pin']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
    navigateToTables: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Tables' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflinePinContainer);
