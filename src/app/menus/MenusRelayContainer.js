// @flow

import { createFragmentContainer, graphql } from 'react-relay';
import MenusNavigationTabContainer from './MenusNavigationTabContainer';

export default createFragmentContainer(
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
  {
    getConnectionFromProps(props) {
      return props.user && props.user.restaurant;
    },
    getFragmentVariables(prevVars) {
      return {
        ...prevVars,
      };
    },
    getVariables(props, fragmentVariables) {
      return {
        restaurantId: fragmentVariables.restaurantId,
      };
    },
    variables: {},
    query: graphql`
      query MenusRelayContainer_user_FragmentQuery($restaurantId: ID!) {
        user {
          ...MenusRelayContainer_user
        }
      }
    `,
  },
);
