// @flow

import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
import { ZonedDateTime, ChronoUnit } from 'js-joda';
import { environment } from '../../framework/relay';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import { ErrorMessageWithRetry } from '@microbusiness/common-react-native';
import { connect } from 'react-redux';
import TableDetailRelayContainer from './TableDetailRelayContainer';

class TableDetail extends Component {
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
          count: 1,
          tableId: this.props.tableId,
          tableIdForTableQuery: this.props.tableId,
          restaurantId: this.props.restaurantId,
          dateRange: this.state.dateRange,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <TableDetailRelayContainer user={props.user} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  }
}

TableDetail.propTypes = {
  tableId: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    tableId: props.navigation.state.params.table.id,
    restaurantId: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
  };
}

export default connect(mapStateToProps)(TableDetail);
