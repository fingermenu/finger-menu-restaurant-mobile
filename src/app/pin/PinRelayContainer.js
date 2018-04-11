// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import PinContainer from './PinContainer';

export default createRefetchContainer(
  PinContainer,
  {
    user: graphql`
      fragment PinRelayContainer_user on User {
        id
        restaurants(first: 1000) @connection(key: "User_restaurants") {
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
          }
        }
      }
    `,
  },
  graphql`
    query PinRelayContainer_user_PaginationQuery {
      user {
        ...PinRelayContainer_user
      }
    }
  `,
);
