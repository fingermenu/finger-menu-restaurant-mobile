// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, QueryRenderer } from 'react-relay';
import MenuItemRelayContainer from './MenuItemRelayContainer';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';

class MenuItem extends Component {
  static navigationOptions = {
    headerTitle: 'Item',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <MenuItemRelayContainer user={props.user} menuItemPriceId={this.props.menuItemPriceId} order={this.props.order} id={this.props.id} />;
    }

    return <LoadingInProgress />;
  };

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
        render={this.renderRelayComponent}
      />
    );
  };
}

MenuItem.propTypes = {
  menuItemPriceId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    menuItemPriceId: state.applicationState.getIn(['activeMenuItemPrice', 'id']),
  };
}

export default connect(mapStateToProps)(MenuItem);
