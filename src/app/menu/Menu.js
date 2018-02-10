// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, QueryRenderer } from 'react-relay';
import { environment } from '../../framework/relay';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
import MenuRelayContainer from './MenuRelayContainer';

class Menu extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query MenuItemsQuery($menuId: ID!, $count: Int!, $cursor: String) {
            user {
              ...MenuRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 1000,
          menuId: this.props.menuId,
        }}
        render={this.renderRelayComponent}
      />
    );
  }

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <MenuRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };
}

Menu.propTypes = {
  menuId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    menuId: props.menuId,
  };
}

export default connect(mapStateToProps)(Menu);
