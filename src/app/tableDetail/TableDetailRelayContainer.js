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
          lastOrderCorrelationId
          name
          customers {
            id
            name
            type
          }
          notes
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
              notes
              placedAt
              cancelledAt
              details {
                id
                paymentGroup {
                  id
                  discount
                  paidAt
                }
                menuItemPrice {
                  id
                  currentPrice
                  menuItem {
                    id
                    name
                    nameToPrintOnCustomerReceipt
                    nameToPrintOnKitchenReceipt
                    imageUrl
                  }
                }
                quantity
                notes
                customer {
                  id
                }
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
                      nameToPrintOnCustomerReceipt
                      nameToPrintOnKitchenReceipt
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
    query TableDetailRelayContainer_user_FragmentQuery($restaurantId: ID!, $tableId: ID, $lastOrderCorrelationId: ID, $tableIdForTableQuery: ID!) {
      user {
        ...TableDetailRelayContainer_user
      }
    }
  `,
);
