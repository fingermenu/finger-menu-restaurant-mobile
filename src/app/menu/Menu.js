// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { environment } from '../../framework/relay';
import MenuRelayContainer from './MenuRelayContainer';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class Menu extends Component {
  componentDidMount = () => {
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Menu` }));
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <MenuRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query MenuQuery($menuId: ID!) {
            user {
              ...MenuRelayContainer_user
            }
          }
        `}
        variables={{
          menuId: this.props.menuId,
        }}
        render={this.renderRelayComponent}
      />
    );
  };
}

Menu.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  menuId: PropTypes.string.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
