// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import StoresFilterContainer from './StoresFilterContainer';

export default createPaginationContainer(
  StoresFilterContainer,
  {
    viewer: graphql`
      fragment StoresFilterRelayContainer_viewer on Viewer {
        id
        stores(first: $count, after: $cursor, forDisplay: true) @connection(key: "Viewer_stores") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              key
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
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
    variables: {
      cursor: null,
    },
    query: graphql`
      query StoresFilterRelayContainer_PaginationQuery($count: Int!, $cursor: String) {
        viewer {
          ...StoresFilterRelayContainer_viewer
        }
      }
    `,
  },
);
