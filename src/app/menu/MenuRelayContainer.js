// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import MenuContainer from './MenuContainer';

export default createRefetchContainer(
  MenuContainer,
  {
    user: graphql`
      fragment MenuRelayContainer_user on User {
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
        dishTypes(first: 1000, after: null) {
          edges {
            node {
              id
              tag {
                id
                name
              }
            }
          }
        }
        menu(menuId: $menuId) {
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
            tags {
              id
            }
            defaultChoiceItemPrices {
              currentPrice
            }
          }
          tags {
            id
          }
        }
      }
    `,
  },
  graphql`
    query MenuRelayContainer_user_FragmentQuery($menuId: ID!) {
      user {
        ...MenuRelayContainer_user
      }
    }
  `,
);
