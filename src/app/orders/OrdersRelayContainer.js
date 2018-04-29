// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import OrdersContainer from './OrdersContainer';

export default createRefetchContainer(
  OrdersContainer,
  {
    user: graphql`
      fragment OrdersRelayContainer_user on User {
        id
        restaurant(restaurantId: $restaurantId) {
          menus {
            id
            name
            sortOrderIndex
          }
        }
        table(tableId: $tableId) {
          id
          name
        }
        menuItemPrices(menuItemPriceIds: $menuItemPriceIds, first: 1000, after: null) {
          edges {
            node {
              id
              currentPrice
              menuItem {
                name
                imageUrl
              }
            }
          }
        }
        choiceItemPrices(choiceItemPriceIds: $choiceItemPriceIds, first: 1000, after: null) {
          edges {
            node {
              id
              currentPrice
              choiceItem {
                name
              }
            }
          }
        }
        orders(first: 1000, tableId: $tableId, correlationId: $correlationId, restaurantId: $restaurantId, sortOption: "PlacedAtDescending")
          @connection(key: "User_orders") {
          edges {
            node {
              id
              numberOfAdults
              numberOfChildren
              customerName
              notes
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
    query OrdersRelayContainer_user_FragmentQuery(
      $restaurantId: ID!
      $tableId: ID!
      $choiceItemPriceIds: [ID!]
      $menuItemPriceIds: [ID!]
      $correlationId: ID
    ) {
      user {
        ...OrdersRelayContainer_user
      }
    }
  `,
);
