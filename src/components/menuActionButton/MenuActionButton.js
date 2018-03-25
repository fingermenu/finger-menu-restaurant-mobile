// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { environment } from '../../framework/relay';
import MenuActionButtonRelayContainer from './MenuActionButtonRelayContainer';

class MenuActionButton extends Component {
  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <MenuActionButtonRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query MenuActionButtonQuery($restaurantId: ID!) {
            user {
              ...MenuActionButtonRelayContainer_user
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
}

MenuActionButton.propTypes = {
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
  };
}

export default connect(mapStateToProps)(MenuActionButton);
