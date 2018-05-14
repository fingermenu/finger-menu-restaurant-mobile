// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import TablesContainer from './TablesContainer';

export default createRefetchContainer(
  TablesContainer,
  {
    user: graphql`
      fragment TablesRelayContainer_user on User {
        id
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
            languages {
              defaultDisplay
            }
            documentTemplates {
              name
              template
            }
            numberOfPrintCopiesForKitchen
          }
          packageBundle {
            url
            checksum
          }
        }
        tables(first: 1000, restaurantId: $restaurantId) @connection(key: "User_tables") {
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
              customers {
                id
                name
                type
              }
              notes
              sortOrderIndex
            }
          }
        }
      }
    `,
  },
  graphql`
    query TablesRelayContainerFragmentQuery($restaurantId: ID!) {
      user {
        ...TablesRelayContainer_user
      }
    }
  `,
);
