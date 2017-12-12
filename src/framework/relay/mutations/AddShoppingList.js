// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import uuid from 'uuid/v4';
import { MessageType } from 'micro-business-common-react';
import * as messageBarActions from 'micro-business-common-react/src/messageBar/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation AddShoppingListMutation($input: AddShoppingListInput!) {
    addShoppingList(input: $input) {
      errorMessage
      shoppingList {
        __typename
        cursor
        node {
          id
          name
          totalItemsCount
        }
      }
    }
  }
`;

const sharedUpdater = (store, userId, shoppingListItemsEdge) => {
  const userProxy = store.get(userId);
  const connection = ConnectionHandler.getConnection(userProxy, 'User_shoppingLists');

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeAfter(connection, shoppingListItemsEdge);
};

const commit = (environment, userId, name) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        name,
      },
    },
    updater: store => {
      const payload = store.getRootField('addShoppingList');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, MessageType.ERROR));
      } else {
        const shoppingListEdge = payload.getLinkedRecord('shoppingList');

        sharedUpdater(store, userId, shoppingListEdge);
      }
    },
    optimisticUpdater: store => {
      const id = uuid();
      const node = store.create(id, 'item');

      node.setValue(true, 'savingInProgress');
      node.setValue(id, 'id');
      node.setValue(name, 'name');
      node.setValue(0, 'totalItemsCount');

      const shoppingListEdge = store.create(uuid(), 'ShoppingListEdge');

      shoppingListEdge.setLinkedRecord(node, 'node');
      sharedUpdater(store, userId, shoppingListEdge);
    },
  });
};

export default {
  commit,
};
