// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import TablesRelayContainer from './TablesRelayContainer';
import { HeaderContainer } from '../../components/header';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class Tables extends Component {
  static navigationOptions = () => ({
    title: 'Tables',
    headerTitle: <HeaderContainer showOpenDrawerIcon />,
    headerTintColor: DefaultColor.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
  });

  componentDidMount = () => {
    const { applicationStateActions, i18n, defaultDisplayLanguage, googleAnalyticsTrackerActions } = this.props;

    applicationStateActions.clearActiveTable();
    applicationStateActions.clearActiveCustomers();

    const language = defaultDisplayLanguage ? defaultDisplayLanguage : 'en_NZ';

    i18n.changeLanguage(language);
    applicationStateActions.selectedLanguageChanged(language);

    googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Tables` }));
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
    const { restaurantId } = this.props;

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
          restaurantId,
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
  defaultDisplayLanguage: PropTypes.string,
};

Tables.defaultProps = {
  defaultDisplayLanguage: null,
};

const mapStateToProps = state => ({
  restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
  defaultDisplayLanguage: state.applicationState.getIn(['activeRestaurant', 'configurations', 'languages', 'defaultDisplay']),
});

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Tables));
