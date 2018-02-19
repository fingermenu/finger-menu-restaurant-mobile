// @flow

import { createFragmentContainer, graphql } from 'react-relay';
import MenuActionButtonContainer from './MenuActionButtonContainer';

export default createFragmentContainer(
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
      query MenuActionButtonRelayContainer_user_FragmentQuery($restaurantId: ID!) {
        user {
          ...MenuActionButtonRelayContainer_user
        }
      }
    `,
  },
);
