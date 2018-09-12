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
            customerId
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
                orderMenuItemPriceId
                paymentGroup {
                  paymentGroupId
                  eftpos
                  cash
                  discount
                  paidAt
                }
                menuItemPrice {
                  id
                  currentPrice
                  menuItem {
                    id
                    name
                    nameWithLanguages {
                      language
                      value
                    }
                    linkedPrinters
                    imageUrl
                  }
                }
                quantity
                notes
                customer {
                  customerId
                }
                servingTime {
                  id
                  tag {
                    nameWithLanguages {
                      language
                      value
                    }
                  }
                }
                paid
                orderChoiceItemPrices {
                  orderChoiceItemPriceId
                  notes
                  quantity
                  paid
                  choiceItemPrice {
                    id
                    currentPrice
                    choiceItem {
                      id
                      name
                      nameWithLanguages {
                        language
                        value
                      }
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
