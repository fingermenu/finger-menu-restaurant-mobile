// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import TablesRelayContainer from './TablesRelayContainer';
import { HeaderContainer } from '../../components/header/';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class Tables extends Component {
  static navigationOptions = () => ({
    title: 'Tables',
    headerTitle: <HeaderContainer />,
    headerTintColor: DefaultColor.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
  });

  componentDidMount = () => {
    this.props.applicationStateActions.clearActiveTable();
    this.props.applicationStateActions.clearActiveCustomer();
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Tables` }));
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <TablesRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query TablesQuery($restaurantId: ID!) {
            user {
              ...TablesRelayContainer_user
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

Tables.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
