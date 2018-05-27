// @flow

import * as userAccessActions from '@microbusiness/common-react/src/userAccess/Actions';
import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StackActions, NavigationActions } from 'react-navigation';
import PinView from './PinView';
import { eventPrefix } from '../../framework/AnalyticHelper';
import PackageBundleHelper from '../../framework/PackageBundleHelper';

class OfflinePinContainer extends Component {
  cleanDevice = async () => {
    await PackageBundleHelper.cleanAllData();

    this.props.userAccessActions.signOut();
  };

  handleSecretPinMatched = () => {
    AsyncStorage.clear(() => {
      this.cleanDevice();
    });
  };

  handlePinMatched = () => {
    this.props.googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}OfflinePin-navigate`, optionalValues: Map({ label: 'Tables', value: 0 }) }),
    );
    this.props.navigateToTables();
  };

  render = () => (
    <PinView secretPin="1875" matchingPin={this.props.pin} onSecretPinMatched={this.handleSecretPinMatched} onPinMatched={this.handlePinMatched} />
  );
}

OfflinePinContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  userAccessActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTables: PropTypes.func.isRequired,
  pin: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  pin: state.applicationState.getIn(['activeRestaurant', 'pin']),
});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  userAccessActions: bindActionCreators(userAccessActions, dispatch),
  navigateToTables: () => dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Tables' })] })),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfflinePinContainer);
