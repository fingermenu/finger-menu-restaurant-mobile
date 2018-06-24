// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LandingView from './LandingView';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class LandingContainer extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount = () => {
    const { googleAnalyticsTrackerActions } = this.props;

    googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Landing` }));
  };

  render = () => {
    const { backgroundImageUrl, navigateToMenu } = this.props;

    return <LandingView backgroundImageUrl={backgroundImageUrl} onEnterButtonPressed={navigateToMenu} />;
  };
}

LandingContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenu: PropTypes.func.isRequired,
  backgroundImageUrl: PropTypes.string,
};

LandingContainer.defaultProps = {
  backgroundImageUrl: null,
};

const mapStateToProps = state => ({
  backgroundImageUrl: state.applicationState.getIn(['activeRestaurant', 'configurations', 'images', 'primaryLandingPageBackgroundImageUrl']),
});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  navigateToMenu: () => dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingContainer);
