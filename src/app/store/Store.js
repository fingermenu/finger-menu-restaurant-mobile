// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import StoreRelayContainer from './StoreRelayContainer';
import { LoadingInProgress } from '../../sharedComponents/loadingInProgress';
import { ErrorMessageWithRetry } from '../../sharedComponents/errorMessageWithRetry';
import { Color } from '../../framework/style/DefaultStyles';

class Store extends Component {
  static navigationOptions = {
    title: 'Store',
    headerTintColor: Color.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query StoreQuery($storeId: ID!) {
            viewer {
              ...StoreRelayContainer_viewer
            }
          }
        `}
        variables={{
          storeId: this.props.storeId,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <StoreRelayContainer viewer={props.viewer} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  }
}

Store.propTypes = {
  storeId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    storeId: props.navigation.state.params.storeId,
  };
}

export default connect(mapStateToProps)(Store);
