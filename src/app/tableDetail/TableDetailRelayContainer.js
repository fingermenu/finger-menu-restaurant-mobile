// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import TableDetailContainer from './TableDetailContainer';

export default createPaginationContainer(
  TableDetailContainer,
  {
    user: graphql`
      fragment TableDetailRelayContainer_user on User {
        table(tableId: $tableIdForTableQuery) {
          id
          name
          tableState {
            name
          }
        }
        orders(
          first: $count
          after: $cursor
          tableId: $tableId
          restaurantId: $restaurantId
          dateRange: $dateRange
          sortOption: "PlacedAtDescending"
        ) @connection(key: "User_orders") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              numberOfAdults
              numberOfChildren
              customerName
              notes
              totalPrice
              placedAt
              cancelledAt
              details {
                menuItemPrice {
                  id
                  currentPrice
                  menuItem {
                    id
                    name
                    description
                  }
                  size {
                    id
                    name
                    description
                    forDisplay
                  }
                }
                quantity
                notes
                paid
                orderChoiceItemPrices {
                  choiceItemPrice {
                    id
                    currentPrice
                    choiceItem {
                      id
                      name
                      description
                    }
                    size {
                      id
                      name
                      description
                      forDisplay
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.orders;
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
        tableId: fragmentVariables.tableId,
        tableIdForTableQuery: fragmentVariables.tableIdForTableQuery,
        restaurantId: fragmentVariables.restaurantId,
        dateRange: fragmentVariables.dateRange,
      };
    },
    variables: { cursor: null },
    query: graphql`
      query TableDetailRelayContainer_user_PaginationQuery(
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
    `,
  },
);
