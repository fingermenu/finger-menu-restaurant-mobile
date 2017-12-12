// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { MessageType } from 'micro-business-common-react';
import * as messageBarActions from 'micro-business-common-react/src/messageBar/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation RemoveShoppingListMutation($input: RemoveShoppingListInput!) {
    removeShoppingList(input: $input) {
      errorMessage
    }
  }
`;

const sharedUpdater = (store, userId, shoppingListId) => {
  const userProxy = store.get(userId);
  const connection = ConnectionHandler.getConnection(userProxy, 'User_shoppingLists');

  if (!connection) {
    return;
  }

  ConnectionHandler.deleteNode(connection, shoppingListId);
};

const commit = (environment, userId, shoppingListId) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        shoppingListId,
      },
    },
    updater: store => {
      const payload = store.getRootField('removeShoppingList');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, MessageType.ERROR));
      } else {
        sharedUpdater(store, userId, shoppingListId);
      }
    },
    optimisticUpdater: store => {
      sharedUpdater(store, userId, shoppingListId);
    },
  });
};

export default {
  commit,
};
