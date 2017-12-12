// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { MessageType } from 'micro-business-common-react';
import * as messageBarActions from 'micro-business-common-react/src/messageBar/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation RemoveItemsFromShoppingListMutation($input: RemoveItemsFromShoppingListInput!) {
    removeItemsFromShoppingList(input: $input) {
      errorMessage
    }
  }
`;

const sharedUpdater = (store, userId, shoppingListItemId) => {
  const userProxy = store.get(userId);
  const connection = ConnectionHandler.getConnection(userProxy, 'User_defaultShoppingListItems');

  if (!connection) {
    return;
  }

  ConnectionHandler.deleteNode(connection, shoppingListItemId);
};

const commit = (environment, userId, shoppingListId, shoppingListItemIds) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        shoppingListId,
        shoppingListItemIds,
      },
    },
    updater: store => {
      const payload = store.getRootField('removeItemsFromShoppingList');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, MessageType.ERROR));
      } else {
        shoppingListItemIds.forEach(shoppingListItemId => {
          sharedUpdater(store, userId, shoppingListItemId);
        });
      }
    },
    optimisticUpdater: store => {
      shoppingListItemIds.forEach(shoppingListItemId => {
        sharedUpdater(store, userId, shoppingListItemId);
      });
    },
  });
};

export default {
  commit,
};
