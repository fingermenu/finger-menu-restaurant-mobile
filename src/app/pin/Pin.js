// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { bindActionCreators } from 'redux';
import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
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

  static getDerivedStateFromProps = nextProps => {
    const {
      restaurant: { id, pin, configurations },
    } = nextProps;

    if (id && pin && configurations && id !== nextProps.activeRestaurant.id) {
      nextProps.applicationStateActions.setActiveRestaurant(Map({ id, pin, configurations: Immutable.fromJS(JSON.parse(configurations)) }));
    }

    return null;
  };

  state = {};

  componentDidMount = () => {
    if (!this.props.activeRestaurant.id) {
      this.props.asyncStorageActions.readValue(Map({ key: 'restaurantId' }));
      this.props.asyncStorageActions.readValue(Map({ key: 'pin' }));
      this.props.asyncStorageActions.readValue(Map({ key: 'restaurantConfigurations' }));
    }

    this.props.i18n.changeLanguage('en_NZ');
    this.props.applicationStateActions.selectedLanguageChanged('en_NZ');
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Pin` }));
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

  render() {
    if (this.props.activeRestaurant.id) {
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
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Pin));
