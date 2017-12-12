// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import CategoriesFilterContainer from './CategoriesFilterContainer';

export default createPaginationContainer(
  CategoriesFilterContainer,
  {
    viewer: graphql`
      fragment CategoriesFilterRelayContainer_viewer on Viewer {
        id
        tags(first: $count, after: $cursor, forDisplay: true) @connection(key: "Viewer_tags") {
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
      query CategoriesFilterRelayContainer_PaginationQuery($count: Int!, $cursor: String) {
        viewer {
          ...CategoriesFilterRelayContainer_viewer
        }
      }
    `,
  },
);
