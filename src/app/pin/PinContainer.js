// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PinView from './PinView';

class PinContainer extends Component {
  componentDidMount = () => {
    const { restaurant: { id, pin, configurations } } = this.props;

    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
  };

  handlePinMatched = () => {
    this.props.googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: 'navigate', optionalValues: Map({ label: 'Pin to Tables', value: 0 }) }),
    );
    this.props.navigateToTables();
  };

  render = () => <PinView onPinMatched={this.handlePinMatched} matchingPin={this.props.restaurant.pin} />;
}

PinContainer.propTypes = {
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTables: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    restaurant: props.user.restaurants.edges[0].node,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
    navigateToTables: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Tables' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PinContainer);
