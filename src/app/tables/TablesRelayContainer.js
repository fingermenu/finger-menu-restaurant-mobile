// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import TablesContainer from './TablesContainer';

export default createPaginationContainer(
  TablesContainer,
  {
    user: graphql`
      fragment TablesRelayContainer_user on User {
        id
        tables(first: $count, after: $cursor, restaurantId: $restaurantId) @connection(key: "User_tables") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              tableState {
                id
                key
                name
              }
              numberOfAdults
              numberOfChildren
              customerName
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.tables;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        restaurantId: fragmentVariables.restaurantId,
      };
    },
    variables: {
      cursor: null,
    },
    query: graphql`
      query TablesRelayContainerPaginationQuery($restaurantId: ID!, $count: Int!, $cursor: String) {
        user {
          ...TablesRelayContainer_user
        }
      }
    `,
  },
);
