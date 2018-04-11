// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import MenusContainer from './MenusContainer';

export default createRefetchContainer(
  MenusContainer,
  {
    user: graphql`
      fragment MenusRelayContainer_user on User {
        id
        servingTimes(first: 1000, after: null) {
          edges {
            node {
              id
              tag {
                id
              }
            }
          }
        }
        restaurant(restaurantId: $restaurantId) {
          menus {
            id
            name
            sortOrderIndex
            menuItemPrices {
              id
              currentPrice
              sortOrderIndex
              menuItem {
                id
                name
                description
                imageUrl
              }
            }
            tags {
              id
            }
          }
        }
      }
    `,
  },
  graphql`
    query MenusRelayContainer_user_FragmentQuery($restaurantId: ID!) {
      user {
        ...MenusRelayContainer_user
      }
    }
  `,
);
