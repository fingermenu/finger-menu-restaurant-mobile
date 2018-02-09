// @flow

import { createFragmentContainer, graphql } from 'react-relay';
import MenuItemContainer from './MenuItemContainer';

export default createFragmentContainer(
  MenuItemContainer,
  {
    user: graphql`
      fragment MenuItemRelayContainer_user on User {
        id
        menuItemPrice(menuItemPriceId: $menuItemPriceId) {
          id
          currentPrice
          menuItem {
            id
            name
            description
            imageUrl
          }
          choiceItemPrices {
            id
            currentPrice
            choiceItem {
              description
              id
              name
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.user && props.user.menuItemPrice;
    },
    getFragmentVariables(prevVars) {
      return {
        ...prevVars,
      };
    },
    getVariables(props, fragmentVariables) {
      return {
        menuItemPriceId: fragmentVariables.menuItemPriceId,
      };
    },
    variables: {},
    query: graphql`
      query MenuItemRelayContainer_user_FragmentQuery($menuItemPriceId: ID!) {
        user {
          ...MenuItemRelayContainer_user
        }
      }
    `,
  },
);
