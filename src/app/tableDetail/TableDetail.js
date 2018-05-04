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
import TableDetailRelayContainer from './TableDetailRelayContainer';
import { DefaultColor } from '../../style';
import { screenNamePrefix } from '../../framework/AnalyticHelper';
import packageInfo from '../../../package.json';

class TableDetail extends Component {
  static navigationOptions = {
    headerTitle: 'Table Detail',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  componentDidMount = () => {
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}TableDetail` }));
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <TableDetailRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query TableDetailQuery($appVersion: String, $restaurantId: ID!, $tableId: ID, $lastOrderCorrelationId: ID, $tableIdForTableQuery: ID!) {
            user(appVersion: $appVersion) {
              ...TableDetailRelayContainer_user
            }
          }
        `}
        variables={{
          appVersion: packageInfo.version,
          tableId: this.props.tableId,
          lastOrderCorrelationId: this.props.lastOrderCorrelationId,
          tableIdForTableQuery: this.props.tableId,
          restaurantId: this.props.restaurantId,
        }}
        render={this.renderRelayComponent}
      />
    );
  }
}

TableDetail.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  tableId: PropTypes.string.isRequired,
  lastOrderCorrelationId: PropTypes.string,
  restaurantId: PropTypes.string.isRequired,
};

TableDetail.defaultProps = {
  lastOrderCorrelationId: '',
};

const mapStateToProps = state => {
  const activeTable = state.applicationState.get('activeTable');
  const lastOrderCorrelationId = activeTable.get('lastOrderCorrelationId');

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    tableId: activeTable.get('id'),
    lastOrderCorrelationId: lastOrderCorrelationId ? lastOrderCorrelationId : '',
  };
};

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableDetail);
