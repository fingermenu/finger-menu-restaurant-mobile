// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import PinContainer from './PinContainer';

export default createPaginationContainer(
  PinContainer,
  {
    user: graphql`
      fragment PinRelayContainer_user on User {
        id
        restaurants(first: $count, after: $cursor) @connection(key: "User_restaurants") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              pin
              configurations {
                printers {
                  type
                  name
                  hostname
                  port
                }
              }
              languages {
                key
                name
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
      return props.user && props.user.restaurants;
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
      query PinRelayContainer_user_PaginationQuery($count: Int!, $cursor: String) {
        user {
          ...PinRelayContainer_user
        }
      }
    `,
  },
);
