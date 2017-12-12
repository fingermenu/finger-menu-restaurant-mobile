// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { MessageType } from 'micro-business-common-react';
import * as messageBarActions from 'micro-business-common-react/src/messageBar/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation SetUserDefaultShoppingListMutation($input: SetUserDefaultShoppingListInput!) {
    setUserDefaultShoppingList(input: $input) {
      errorMessage
      shoppingListItems {
        __typename
        cursor
        node {
          id
          productPriceId
          stapleItemId
          name
          imageUrl
          priceToDisplay
          comments
          offerEndDate
          size
          saving
          savingPercentage
          store {
            name
            imageUrl
          }
          unitPrice {
            price
            size
          }
          multiBuy {
            awardQuantity
            awardValue
          }
          tags {
            id
            key
            name
          }
        }
      }
    }
  }
`;

const cleanDefaultShoppingListConnection = (store, userId, currentDefaultShoppingListItemIds) => {
  const userProxy = store.get(userId);
  const connection = ConnectionHandler.getConnection(userProxy, 'User_defaultShoppingListItems');

  if (!connection) {
    return;
  }

  currentDefaultShoppingListItemIds.forEach(id => ConnectionHandler.deleteNode(connection, id));
};

const sharedUpdater = (store, userId, shoppingListItemsEdge, id) => {
  const userProxy = store.get(userId);
  const connection = ConnectionHandler.getConnection(userProxy, 'User_defaultShoppingListItems');

  if (!connection) {
    return;
  }

  if (id) {
    ConnectionHandler.deleteNode(connection, id);
  }

  ConnectionHandler.insertEdgeAfter(connection, shoppingListItemsEdge);
};

const commit = (environment, userId, currentDefaultShoppingListItemIds, shoppingListId) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        shoppingListId,
      },
    },
    updater: store => {
      const payload = store.getRootField('setUserDefaultShoppingList');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, MessageType.ERROR));
      } else {
        cleanDefaultShoppingListConnection(store, userId, currentDefaultShoppingListItemIds);

        const shoppingListItemsEdges = payload.getLinkedRecords('shoppingListItems');

        shoppingListItemsEdges.forEach(shoppingListItemsEdge => {
          const id = shoppingListItemsEdge.getLinkedRecord('node').getValue('id');

          sharedUpdater(store, userId, shoppingListItemsEdge, id);
        });
      }
    },
  });
};

export default {
  commit,
};
