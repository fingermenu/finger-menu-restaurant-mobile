// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import TablesRelayContainer from './TablesRelayContainer';
import { HeaderContainer } from '../../components/header/';

class Tables extends Component {
  static navigationOptions = () => ({
    title: 'Tables',
    headerTitle: <HeaderContainer />,
    headerTintColor: DefaultColor.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
  });

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <TablesRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query TablesQuery($count: Int!, $cursor: String, $restaurantId: ID!) {
            user {
              ...TablesRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 1000,
          restaurantId: this.props.restaurantId,
        }}
        render={this.renderRelayComponent}
      />
    );
  }
}

Tables.propTypes = {
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

export default connect(mapStateToProps)(Tables);
