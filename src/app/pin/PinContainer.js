// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PinView from './PinView';
import { eventPrefix } from '../../framework/AnalyticHelper';

class PinContainer extends Component {
  componentDidMount = () => {
    const {
      restaurant: { id, pin, configurations },
      asyncStorageActions,
    } = this.props;

    asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
  };

  handlePinMatched = () => {
    const { googleAnalyticsTrackerActions, navigateToTables } = this.props;

    googleAnalyticsTrackerActions.trackEvent(
      Map({ category: 'ui-waiter', action: `${eventPrefix}Pin-navigate`, optionalValues: Map({ label: 'Tables', value: 0 }) }),
    );

    navigateToTables();
  };

  render = () => {
    const {
      restaurant: { pin },
    } = this.props;

    return <PinView matchingPin={pin} onPinMatched={this.handlePinMatched} />;
  };
}

PinContainer.propTypes = {
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTables: PropTypes.func.isRequired,
};

const mapStateToProps = (
  state,
  {
    user: {
      restaurants: { edges },
    },
  },
) => ({
  restaurant: edges[0].node,
});

const mapDispatchToProps = dispatch => ({
  asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  navigateToTables: () => dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Tables' })] })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PinContainer);
