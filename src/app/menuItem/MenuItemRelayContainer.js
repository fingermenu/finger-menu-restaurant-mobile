// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import MenuItemContainer from './MenuItemContainer';

export default createRefetchContainer(
  MenuItemContainer,
  {
    user: graphql`
      fragment MenuItemRelayContainer_user on User {
        id
        dietaryOptions(first: 1000, after: null) {
          edges {
            node {
              tag {
                id
              }
            }
          }
        }
        sizes(first: 1000, after: null) {
          edges {
            node {
              tag {
                id
              }
            }
          }
        }
        menuItemPrice(menuItemPriceId: $menuItemPriceId) {
          id
          currentPrice
          menuItem {
            id
            name
            description
            imageUrl
          }
          choiceItemPrices {
            id
            currentPrice
            sortOrderIndex
            choiceItem {
              description
              id
              name
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
    query MenuItemRelayContainer_user_FragmentQuery($menuItemPriceId: ID!) {
      user {
        ...MenuItemRelayContainer_user
      }
    }
  `,
);
