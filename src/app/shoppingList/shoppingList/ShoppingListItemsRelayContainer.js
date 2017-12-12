// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import ShoppingListItemsContainer from './ShoppingListItemsContainer';

export default createPaginationContainer(
  ShoppingListItemsContainer,
  {
    user: graphql`
      fragment ShoppingListItemsRelayContainer_user on User {
        id
        defaultShoppingList {
          id
          name
        }
        defaultShoppingListItems(first: $count, after: $cursor) @connection(key: "User_defaultShoppingListItems") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              productPriceId
              stapleItemId
              name
              imageUrl
              priceToDisplay
              store {
                name
                imageUrl
              }
              comments
              unitPrice {
                price
                size
              }
              multiBuy {
                awardQuantity
                awardValue
              }
              offerEndDate
              size
              savingPercentage
              saving
              tags {
                name
                key
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
      return props.user && props.user.shoppingList;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }) {
      return {
        count,
        cursor,
      };
    },
    variables: {
      cursor: null,
    },
    query: graphql`
      query ShoppingListItemsRelayContainer_user_PaginationQuery($count: Int!, $cursor: String) {
        user {
          ...ShoppingListItemsRelayContainer_user
        }
      }
    `,
  },
);
