// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import MenuActionButtonContainer from './MenuActionButtonContainer';

export default createRefetchContainer(
  MenuActionButtonContainer,
  {
    user: graphql`
      fragment MenuActionButtonRelayContainer_user on User {
        restaurant(restaurantId: $restaurantId) {
          menus {
            id
            name
          }
        }
      }
    `,
  },
  graphql`
    query MenuActionButtonRelayContainer_user_FragmentQuery($restaurantId: ID!) {
      user {
        ...MenuActionButtonRelayContainer_user
      }
    }
  `,
);
