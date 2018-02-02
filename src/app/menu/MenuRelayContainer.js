// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import MenuContainer from './MenuContainer';

export default createPaginationContainer(
  MenuContainer,
  {
    user: graphql`
      fragment MenuRelayContainer_user on User {
        menuItemPrices(menuId: $menuId, first: $count, after: $cursor) @connection(key: "User_menuItemPrices") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              currentPrice
              menuItem {
                id
                name
                description
                imageUrl
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
      return props.user && props.user.menuItemPrices;
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
        menuId: fragmentVariables.menuId,
      };
    },
    variables: {
      cursor: null,
    },
    query: graphql`
      query MenuRelayContainerPaginationQuery($count: Int!, $cursor: String, $menuId: ID!) {
        user {
          ...MenuRelayContainer_user
        }
      }
    `,
  },
);
