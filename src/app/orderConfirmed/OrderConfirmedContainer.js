// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import OrderConfirmedView from './OrderConfirmedView';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class OrderConfirmedContainer extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  componentDidMount = () => {
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}OrderConfirmed` }));
  };

  render = () => <OrderConfirmedView onFingerMenuPressed={this.props.navigateToMenu} restaurantLogoImageUrl={this.props.restaurantLogoImageUrl} />;
}

OrderConfirmedContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenu: PropTypes.func.isRequired,
  restaurantLogoImageUrl: PropTypes.string,
};

OrderConfirmedContainer.defaultProps = {
  restaurantLogoImageUrl: null,
};

function mapStateToProps(state) {
  return {
    restaurantLogoImageUrl: state.applicationState.getIn(['activeRestaurant', 'configurations', 'images', 'logoImageUrl']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
    navigateToMenu: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmedContainer);
