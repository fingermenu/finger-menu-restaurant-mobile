// @flow

import React, { Component } from 'react';
import { environment } from '../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
import PinRelayContainer from './PinRelayContainer';
import OfflinePinContainer from './OfflinePinContainer';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import * as AsyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';

class Pin extends Component {
  componentWillMount = () => {
    this.props.AsyncStorageActions.readValue(Map({ key: 'restaurantId' }));
    this.props.AsyncStorageActions.readValue(Map({ key: 'pin' }));
    this.props.AsyncStorageActions.readValue(Map({ key: 'restaurantName' }));
  };

  render() {
    if (this.props.offlineMode) {
      const { restaurant: { pin, name } } = this.props;
      if (!pin || !name) {
        return <LoadingInProgress />;
      }

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
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <PinRelayContainer user={props.user} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    offlineMode: !!state.asyncStorage.getIn(['keyValues', 'restaurantId']),
    restaurant: {
      name: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
      pin: state.asyncStorage.getIn(['keyValues', 'pin']),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    AsyncStorageActions: bindActionCreators(AsyncStorageActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pin);
