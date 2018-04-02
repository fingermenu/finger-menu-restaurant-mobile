// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';
import Common from './Common';

const mutation = graphql`
  mutation UpdateTableMutation($input: UpdateTableInput!) {
    updateTable(input: $input) {
      table {
        __typename
        cursor
        node {
          id
          name
          numberOfAdults
          numberOfChildren
          customerName
          notes
          lastOrderCorrelationId
          tableState {
            id
            key
            name
          }
        }
      }
    }
  }
`;

const sharedUpdater = (store, user, tableLinkedRecord, connectionFilters) => {
  if (!user) {
    return;
  }

  const userProxy = store.get(user.id);

  if (!userProxy) {
    return;
  }

  const connection = ConnectionHandler.getConnection(userProxy, 'User_tables', connectionFilters);

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeAfter(connection, tableLinkedRecord);
};

const commit = (
  environment,
  { id, tableState, numberOfAdults, numberOfChildren, customerName, notes, lastOrderCorrelationId },
  connectionFilters = {},
  { user } = {},
  { onSuccess, onError } = {},
) => {
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
        lastOrderCorrelationId,
      },
    },
    updater: store => {
      sharedUpdater(store, user, store.getRootField('updateTable').getLinkedRecord('table'), connectionFilters);
    },
    optimisticUpdater: store => {
      sharedUpdater(
        store,
        user,
        Common.createTableNodeForOptimisticUpdater(store, {
          id,
          tableState,
          numberOfAdults,
          numberOfChildren,
          customerName,
          notes,
          lastOrderCorrelationId,
        }),
        connectionFilters,
      );
    },
    onCompleted: (response, errors) => {
      if (errors && errors.length > 0) {
        return;
      }

      if (!onSuccess) {
        return;
      }

      onSuccess(response.updateTable.table.node);
    },
    onError: ({ message: errorMessage }) => {
      reduxStore.dispatch(messageBarActions.add(errorMessage, NotificationType.ERROR));

      if (!onError) {
        return;
      }

      onError(errorMessage);
    },
  });
};

export default commit;
