// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';
import { eventPrefix } from '../../framework/AnalyticHelper';

class OfflinePinContainer extends Component {
  handlePinMatched = () => {
    const { googleAnalyticsTrackerActions, navigateToTables } = this.props;

    googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}OfflinePin-navigate`, optionalValues: Map({ label: 'Tables', value: 0 }) }),
    );
    navigateToTables();
  };

  render = () => {
    const { pin } = this.props;

    return <PinView matchingPin={pin} onPinMatched={this.handlePinMatched} />;
  };
}

OfflinePinContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTables: PropTypes.func.isRequired,
  pin: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  pin: state.applicationState.getIn(['activeRestaurant', 'pin']),
});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  navigateToTables: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Tables' })] })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OfflinePinContainer);
