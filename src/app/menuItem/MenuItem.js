// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { graphql, QueryRenderer } from 'react-relay';
import MenuItemRelayContainer from './MenuItemRelayContainer';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class MenuItem extends Component {
  static navigationOptions = {
    headerTitle: 'Item',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  componentDidMount = () => {
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}MenuItem` }));
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <MenuItemRelayContainer user={props.user} menuItemPriceId={this.props.menuItemPriceId} />;
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
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  menuItemPriceId: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  const activeMenuItemPrice = state.applicationState.get('activeMenuItemPrice');
  const activeOrderMenuItemPrice = state.applicationState.get('activeOrderMenuItemPrice');

  return {
    menuItemPriceId: activeMenuItemPrice.isEmpty() ? activeOrderMenuItemPrice.get('menuItemPriceId') : activeMenuItemPrice.get('id'),
  };
};

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuItem);
