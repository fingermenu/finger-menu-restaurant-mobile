// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { bindActionCreators } from 'redux';
import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import PinRelayContainer from './PinRelayContainer';
import OfflinePinContainer from './OfflinePinContainer';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { ActiveRestaurantProp } from '../../framework/applicationState';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class Pin extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  state = {};

  componentDidMount = () => {
    const {
      activeRestaurant: { id },
      asyncStorageActions,
      googleAnalyticsTrackerActions,
    } = this.props;

    if (!id) {
      asyncStorageActions.readValue(Map({ key: 'restaurantId' }));
      asyncStorageActions.readValue(Map({ key: 'pin' }));
      asyncStorageActions.readValue(Map({ key: 'restaurantConfigurations' }));
      asyncStorageActions.readValue(Map({ key: 'installedPackageBundleChecksum' }));
    }

    googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Pin` }));
  };

  static getDerivedStateFromProps = nextProps => {
    const {
      restaurant: { id, pin, name, configurations },
    } = nextProps;

    if (id && pin && configurations && id !== nextProps.activeRestaurant.id) {
      nextProps.applicationStateActions.setActiveRestaurant(Map({ id, pin, name, configurations: Immutable.fromJS(JSON.parse(configurations)) }));
    }

    return null;
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <PinRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render = () => {
    const {
      activeRestaurant: { id },
    } = this.props;

    if (id) {
      return <OfflinePinContainer />;
    }

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query PinQuery {
            user {
              ...PinRelayContainer_user
            }
          }
        `}
        variables={{}}
        render={this.renderRelayComponent}
      />
    );
  };
}

Pin.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  activeRestaurant: ActiveRestaurantProp.isRequired,
};

const mapStateToProps = state => ({
  activeRestaurant: state.applicationState.get('activeRestaurant').toJS(),
  restaurant: {
    id: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
    pin: state.asyncStorage.getIn(['keyValues', 'pin']),
    configurations: state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations']),
  },
});

const mapDispatchToProps = dispatch => ({
  asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pin);
