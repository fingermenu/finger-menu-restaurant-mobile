// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
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
import { ActiveRestaurantProp } from '../../framework/applicationState/PropTypes';

class Pin extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static getDerivedStateFromProps = nextProps => {
    const { restaurant: { id, pin, name, restaurantConfigurations } } = nextProps;

    if (id && pin && name && restaurantConfigurations && id !== nextProps.activeRestaurant.id) {
      nextProps.applicationStateActions.setActiveRestaurant(
        Map({ id, name, pin, configurations: restaurantConfigurations ? Immutable.fromJS(JSON.parse(restaurantConfigurations)) : Map() }),
      );
    }

    return null;
  };

  state = {};

  componentDidMount = () => {
    if (!this.props.activeRestaurant.id) {
      this.props.asyncStorageActions.readValue(Map({ key: 'restaurantId' }));
      this.props.asyncStorageActions.readValue(Map({ key: 'pin' }));
      this.props.asyncStorageActions.readValue(Map({ key: 'restaurantName' }));
      this.props.asyncStorageActions.readValue(Map({ key: 'restaurantConfigurations' }));
    }

    this.props.i18n.changeLanguage('en_NZ');
    this.props.applicationStateActions.selectedLanguageChanged('en_NZ');
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
          query PinQuery($count: Int!, $cursor: String) {
            user {
              ...PinRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 30,
        }}
        render={this.renderRelayComponent}
      />
    );
  }
}

Pin.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  activeRestaurant: ActiveRestaurantProp.isRequired,
};

function mapStateToProps(state) {
  return {
    activeRestaurant: state.applicationState.get('activeRestaurant').toJS(),
    restaurant: {
      id: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
      name: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
      pin: state.asyncStorage.getIn(['keyValues', 'pin']),
      restaurantConfigurations: state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations']),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Pin));
