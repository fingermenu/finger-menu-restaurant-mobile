// @flow

import { createFragmentContainer, graphql } from 'react-relay';
import StoreContainer from './StoreContainer';

export default createFragmentContainer(
  StoreContainer,
  {
    viewer: graphql`
      fragment StoreRelayContainer_viewer on Viewer {
        store(storeId: $storeId) {
          id
          name
          key
          imageUrl
          address
          openingHours {
            from
            until
          }
          phones {
            label
            number
          }
          geoLocation {
            latitude
            longitude
          }
        }
      }
    `,
  },
  {
    getFragmentVariables(prevVars) {
      return {
        ...prevVars,
      };
    },
    getVariables(props, fragmentVariables) {
      return {
        storeId: fragmentVariables.storeId,
      };
    },
    variables: {},
    query: graphql`
      query StoreRelayContainer_viewer_FragmentQuery($storeId: ID!) {
        viewer {
          ...StoreRelayContainer_viewer
        }
      }
    `,
  },
);
