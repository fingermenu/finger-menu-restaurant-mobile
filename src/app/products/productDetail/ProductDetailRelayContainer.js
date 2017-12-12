// @flow

import { createFragmentContainer, graphql } from 'react-relay';
import ProductDetailContainer from './ProductDetailContainer';

export default createFragmentContainer(
  ProductDetailContainer,
  {
    user: graphql`
      fragment ProductDetailRelayContainer_user on User {
        id
        product(productId: $productId) {
          id
          name
          description
          imageUrl
          priceToDisplay
          productPageUrl
          store {
            id
            name
            imageUrl
            googleMapUrl
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
        shoppingLists(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.user && props.user.product;
    },
    getFragmentVariables(prevVars) {
      return {
        ...prevVars,
      };
    },
    getVariables(props, fragmentVariables) {
      return {
        productId: fragmentVariables.productId,
      };
    },
    variables: {},
    query: graphql`
      query ProductDetailRelayContainer_user_FragmentQuery($productId: ID!) {
        user {
          ...ProductDetailRelayContainer_user
        }
      }
    `,
  },
);
