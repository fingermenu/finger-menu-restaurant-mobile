// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
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

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <TablesRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };
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
