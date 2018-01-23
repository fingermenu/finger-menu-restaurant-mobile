// @flow

import React, { Component } from 'react';
import { environment } from '../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
import PinRelayContainer from './PinRelayContainer';

class Pin extends Component {
  render() {
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

export default Pin;
