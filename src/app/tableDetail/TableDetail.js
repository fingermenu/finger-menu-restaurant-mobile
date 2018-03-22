// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
import { ZonedDateTime, ChronoUnit } from 'js-joda';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import TableDetailRelayContainer from './TableDetailRelayContainer';
import { DefaultColor } from '../../style';

class TableDetail extends Component {
  static navigationOptions = {
    headerTitle: 'Table Detail',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  state = {
    dateRange: {
      from: ZonedDateTime.now()
        .truncatedTo(ChronoUnit.DAYS)
        .toString(),
      to: ZonedDateTime.now()
        .truncatedTo(ChronoUnit.DAYS)
        .plusHours(23)
        .plusMinutes(59)
        .plusSeconds(59)
        .toString(),
    },
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
          query TableDetailQuery(
            $count: Int!
            $cursor: String
            $restaurantId: ID!
            $tableId: ID
            $lastOrderCorrelationId: ID
            $tableIdForTableQuery: ID!
            $dateRange: DateRange!
          ) {
            user {
              ...TableDetailRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 1000,
          tableId: this.props.tableId,
          lastOrderCorrelationId: this.props.lastOrderCorrelationId,
          tableIdForTableQuery: this.props.tableId,
          restaurantId: this.props.restaurantId,
          dateRange: this.state.dateRange,
        }}
        render={this.renderRelayComponent}
      />
    );
  }
}

TableDetail.propTypes = {
  tableId: PropTypes.string.isRequired,
  lastOrderCorrelationId: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    tableId: props.navigation.state.params.table.id,
    lastOrderCorrelationId: props.navigation.state.params.table.lastOrderCorrelationId,
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

export default connect(mapStateToProps)(TableDetail);
