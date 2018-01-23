// @flow

import { createFragmentContainer, graphql } from 'react-relay';
import TablesContainer from './TablesContainer';

export default createFragmentContainer(
  TablesContainer,
  {
    user: graphql`
      fragment TablesRelayContainer_user on User {
        id
        restaurant(restaurantId: $restaurantId) {
          id
          name
          websiteUrl
          phones {
            label
            number
          }
          tables {
            id
            name
            tableState {
              id
              key
              name
            }
            numberOfAdults
            numberOfChildren
            customerName
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.restanurant;
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
      query TablesRelayContainer_user_FragmentQuery($restaurantId: ID!) {
        user {
          ...TablesRelayContainer_user
        }
      }
    `,
  },
);
