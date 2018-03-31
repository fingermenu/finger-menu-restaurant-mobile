// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import OrdersContainer from './OrdersContainer';

export default createRefetchContainer(
  OrdersContainer,
  {
    user: graphql`
      fragment OrdersRelayContainer_user on User {
        restaurant(restaurantId: $restaurantId) {
          menus {
            id
            name
          }
        }
        table(tableId: $tableId) {
          id
          name
        }
        menuItemPrices(menuItemPriceIds: $menuItemPriceIds, first: 1000, after: null) {
          pageInfo {
            hasNextPage
            endCursor
          }
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
          pageInfo {
            hasNextPage
            endCursor
          }
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
      }
    `,
  },
  graphql`
    query OrdersRelayContainer_user_PaginationQuery($restaurantId: ID!, $tableId: ID!, $choiceItemPriceIds: [ID!], $menuItemPriceIds: [ID!]) {
      user {
        ...OrdersRelayContainer_user
      }
    }
  `,
);
