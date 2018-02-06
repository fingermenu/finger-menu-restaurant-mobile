// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
import MenuItemRelayContainer from './MenuItemRelayContainer';

class MenuItem extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: navigation.state.params ? (navigation.state.params.title ? navigation.state.params.title : '') : '',
  //   headerStyle: {
  //     backgroundColor: Color.secondaryColorAction,
  //   },
  //   headerTintColor: Color.headerIconDefaultColor,
  // });

  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query MenuItemQuery($menuItemPriceId: ID!) {
            user {
              ...MenuItemRelayContainer_user
            }
          }
        `}
        variables={{
          menuItemPriceId: this.props.menuItemPriceId,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return (
              <MenuItemRelayContainer
                user={props.user}
                menuItemPriceId={this.props.menuItemPriceId}
                order={this.props.order}
                orderItemId={this.props.orderItemId}
              />
            );
          }

          return <LoadingInProgress />;
        }}
      />
    );
  };
}

MenuItem.propTypes = {
  menuItemPriceId: PropTypes.string.isRequired,
  orderItemId: PropTypes.string,
};

function mapStateToProps(state, props) {
  return {
    menuItemPriceId: props.navigation.state.params.menuItemPriceId,
    order: props.navigation.state.params && props.navigation.state.params.order ? props.navigation.state.params.order : null,
    orderItemId: props.navigation.state.params && props.navigation.state.params.orderItemId ? props.navigation.state.params.orderItemId : null,
  };
}

export default connect(mapStateToProps)(MenuItem);
