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
          name
          pin
          configurations {
            printers {
              type
              name
              hostname
              port
              maxLineWidth
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
              printOnCustomerReceipt
              printOnKitchenReceipt
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
                customerId
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
