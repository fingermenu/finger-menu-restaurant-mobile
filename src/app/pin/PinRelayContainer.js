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
                  maxLineWidthDivisionFactor
                  linkedPrinters {
                    name
                    language
                    numberOfPrints
                  }
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
    query PinRelayContainer_user_FragmentQuery {
      user {
        ...PinRelayContainer_user
      }
    }
  `,
);
