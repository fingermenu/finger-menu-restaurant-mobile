// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import TablesContainer from './TablesContainer';

export default createPaginationContainer(
  TablesContainer,
  {
    user: graphql`
      fragment TablesRelayContainer_user on User {
        restaurant(restaurantId: $restaurantId) {
          id
          pin
          configurations {
            printers {
              type
              name
              hostname
              port
            }
            images {
              logoImageUrl
              primaryLandingPageBackgroundImageUrl
              secondaryLandingPageBackgroundImageUrl
              primaryTopBannerImageUrl
              secondaryTopBannerImageUrl
            }
            documentTemplates {
              name
              template
            }
            numberOfPrintCopiesForKitchen
          }
        }
        tables(first: $count, after: $cursor, restaurantId: $restaurantId) @connection(key: "User_tables") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              lastOrderCorrelationId
              name
              tableState {
                id
                key
                name
              }
              numberOfAdults
              numberOfChildren
              customerName
              notes
              sortOrderIndex
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.tables;
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
        restaurantId: fragmentVariables.restaurantId,
      };
    },
    variables: {
      cursor: null,
    },
    query: graphql`
      query TablesRelayContainerPaginationQuery($restaurantId: ID!, $count: Int!, $cursor: String) {
        user {
          ...TablesRelayContainer_user
        }
      }
    `,
  },
);
