// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import uuid from 'uuid/v4';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation UpdateTableMutation($input: UpdateTableInput!) {
    updateTable(input: $input) {
      errorMessage
      table {
        id
        name
        numberOfAdults
        numberOfChildren
        customerName
        notes
        tableState {
          id
          key
          name
        }
      }
    }
  }
`;

const sharedUpdater = (store, userId, tablesEdge) => {
  const userProxy = store.get(userId);
  const connection = ConnectionHandler.getConnection(userProxy, 'User_tables');

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeAfter(connection, tablesEdge);
};

const commit = (environment, userId, id, tableState, numberOfAdults, numberOfChildren, customerName, notes) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id,
        tableState,
        numberOfAdults,
        numberOfChildren,
        customerName,
        notes,
      },
    },
    updater: store => {
      const payload = store.getRootField('updateTable');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, NotificationType.ERROR));
      } else {
        const tablesEdge = payload.getLinkedRecord('tables');

        sharedUpdater(store, userId, tablesEdge);
      }
    },
    optimisticUpdater: store => {
      const id = uuid();
      const node = store.create(id, 'item');

      node.setValue(true, 'savingInProgress');
      node.setValue(id, 'id');
      node.setValue(numberOfAdults, 'numberOfAdults');
      node.setValue(numberOfChildren, 'numberOfChildren');
      node.setValue(customerName, 'customerName');
      node.setValue(notes, 'notes');
      node.setValue(tableState, 'tableState');

      const tablesEdge = store.create(uuid(), 'tablesEdge');

      tablesEdge.setLinkedRecord(node, 'node');
      sharedUpdater(store, userId, tablesEdge);
    },
  });
};

export default {
  commit,
};
