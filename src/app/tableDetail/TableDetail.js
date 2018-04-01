// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
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
          query TableDetailQuery($restaurantId: ID!, $tableId: ID, $lastOrderCorrelationId: ID, $tableIdForTableQuery: ID!) {
            user {
              ...TableDetailRelayContainer_user
            }
          }
        `}
        variables={{
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
  tableId: PropTypes.string.isRequired,
  lastOrderCorrelationId: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const activeTable = state.applicationState.get('activeTable');

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    tableId: activeTable.get('id'),
    lastOrderCorrelationId: activeTable.get('lastOrderCorrelationId'),
  };
}

export default connect(mapStateToProps)(TableDetail);
