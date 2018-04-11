// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import TableDetailContainer from './TableDetailContainer';

export default createRefetchContainer(
  TableDetailContainer,
  {
    user: graphql`
      fragment TableDetailRelayContainer_user on User {
        id
        table(tableId: $tableIdForTableQuery) {
          id
          name
          tableState {
            key
            name
          }
        }
        orders(first: 1000, tableId: $tableId, correlationId: $lastOrderCorrelationId, restaurantId: $restaurantId, sortOption: "PlacedAtDescending")
          @connection(key: "User_orders") {
          edges {
            node {
              id
              correlationId
              numberOfAdults
              numberOfChildren
              customerName
              notes
              totalPrice
              placedAt
              cancelledAt
              details {
                id
                menuItemPrice {
                  id
                  currentPrice
                  menuItem {
                    id
                    name
                    imageUrl
                  }
                }
                quantity
                notes
                paid
                orderChoiceItemPrices {
                  id
                  notes
                  quantity
                  paid
                  choiceItemPrice {
                    id
                    currentPrice
                    choiceItem {
                      id
                      name
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
  graphql`
    query TableDetailRelayContainer_user_PaginationQuery($restaurantId: ID!, $tableId: ID, $lastOrderCorrelationId: ID, $tableIdForTableQuery: ID!) {
      user {
        ...TableDetailRelayContainer_user
      }
    }
  `,
);
