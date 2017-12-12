// @flow

import { createPaginationContainer, graphql } from 'react-relay';
import ProductsContainer from './ProductsContainer';

export default createPaginationContainer(
  ProductsContainer,
  {
    user: graphql`
      fragment ProductsRelayContainer_user on User {
        id
        products(first: $count, after: $cursor, name: $searchKeyword, sortOption: $sortOption, tagKeys: $categories, storeKeys: $stores)
          @connection(key: "User_products") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              imageUrl
              priceToDisplay
              store {
                name
                imageUrl
              }
              comments
              unitPrice {
                price
                size
              }
              multiBuy {
                awardQuantity
                awardValue
              }
              offerEndDate
              size
              savingPercentage
              saving
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.products;
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
        searchKeyword: fragmentVariables.searchKeyword,
        sortOption: fragmentVariables.sortOption,
        categories: fragmentVariables.categories,
        stores: fragmentVariables.stores,
      };
    },
    variables: {
      cursor: null,
    },
    query: graphql`
      query ProductsRelayContainerPaginationQuery(
        $count: Int!
        $cursor: String
        $searchKeyword: String
        $sortOption: String
        $categories: [String]
        $stores: [String]
      ) {
        user {
          ...ProductsRelayContainer_user
        }
      }
    `,
  },
);
