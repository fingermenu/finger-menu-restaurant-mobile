// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import ShoppingListsContainer from './ShoppingListsContainer';

export default createPaginationContainer(
  ShoppingListsContainer,
  {
    user: graphql`
      fragment ShoppingListsRelayContainer_user on User {
        id
        defaultShoppingList {
          id
        }
        shoppingLists(first: $count, after: $cursor) @connection(key: "User_shoppingLists") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              totalItemsCount
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
    variables: { cursor: null },
    query: graphql`
      query ShoppingListsRelayContainer_user_PaginationQuery($count: Int!, $cursor: String) {
        user {
          ...ShoppingListsRelayContainer_user
        }
      }
    `,
  },
);
