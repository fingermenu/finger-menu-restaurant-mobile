// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import MenusNavigationTabContainer from './MenusNavigationTabContainer';

export default createRefetchContainer(
  MenusNavigationTabContainer,
  {
    user: graphql`
      fragment MenusRelayContainer_user on User {
        restaurant(restaurantId: $restaurantId) {
          menus {
            id
            name
            sortOrderIndex
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
