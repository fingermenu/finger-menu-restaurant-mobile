// @flow

import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { environment } from '../../framework/relay';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
import MenusRelayContainer from './MenusRelayContainer';

class Menus extends Component {
  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query MenusQuery($restaurantId: ID!) {
            user {
              ...MenusRelayContainer_user
            }
          }
        `}
        variables={{
          restaurantId: this.props.restaurantId,
        }}
        render={this.renderRelayComponent}
      />
    );
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <MenusRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };
}

Menus.propTypes = {
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

export default connect(mapStateToProps)(Menus);
