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
      errorMessage
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

const sharedUpdater = (store, user, tableLinkedRecord) => {
  if (!user) {
    return;
  }

  const userProxy = store.get(user.id);

  if (!userProxy) {
    return;
  }

  const connection = ConnectionHandler.getConnection(userProxy, 'User_tables');

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeAfter(connection, tableLinkedRecord);
};

const commit = (
  environment,
  { id, tableState, numberOfAdults, numberOfChildren, customerName, notes, lastOrderCorrelationId },
  { user } = {},
  { onSuccess, onFailure } = {},
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
      const rootField = store.getRootField('updateTable');
      const errorMessage = rootField.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, NotificationType.ERROR));

        if (!onFailure) {
          return;
        }

        onFailure(errorMessage);
      } else {
        const tableLinkedRecord = rootField.getLinkedRecord('table');

        sharedUpdater(store, user, tableLinkedRecord);

        if (!onSuccess) {
          return;
        }

        onSuccess(Common.convertTableMutationResponseToMap(tableLinkedRecord));
      }
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
      );
    },
  });
};

export default commit;
