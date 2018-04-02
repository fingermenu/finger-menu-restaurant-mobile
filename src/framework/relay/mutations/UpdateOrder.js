// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';
import Common from './Common';

const mutation = graphql`
  mutation UpdateOrderMutation($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      errorMessage
      order {
        __typename
        cursor
        node {
          id
          correlationId
          numberOfAdults
          numberOfChildren
          customerName
          notes
          totalPrice
          placedAt
          cancelledAt
          details {
            id
            menuItemPrice {
              id
              currentPrice
              menuItem {
                id
                name
                nameToPrint
                description
              }
            }
            quantity
            notes
            paid
            orderChoiceItemPrices {
              id
              notes
              quantity
              paid
              choiceItemPrice {
                id
                currentPrice
                choiceItem {
                  id
                  name
                  nameToPrint
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;

const sharedUpdater = (store, user, ordersEdge) => {
  if (!user) {
    return;
  }

  const userProxy = store.get(user.id);

  if (!userProxy) {
    return;
  }

  const connection = ConnectionHandler.getConnection(userProxy, 'User_orders');

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeAfter(connection, ordersEdge);
};

const commit = (
  environment,
  { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
  menuItemPrices,
  choiceItemPrices,
  { user } = {},
  { onSuccess, onFailure } = {},
) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id,
        restaurantId,
        tableId,
        numberOfAdults,
        numberOfChildren,
        customerName,
        notes,
        totalPrice,
        details,
      },
    },
    updater: store => {
      const rootField = store.getRootField('updateOrder');
      const errorMessage = rootField.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, NotificationType.ERROR));

        if (!onFailure) {
          return;
        }

        onFailure(errorMessage);
      } else {
        const orderLinkedRecord = rootField.getLinkedRecord('order');

        sharedUpdater(store, user, orderLinkedRecord);

        if (!onSuccess) {
          return;
        }

        onSuccess(Common.convertOrderMutationResponseToMap(orderLinkedRecord));
      }
    },
    optimisticUpdater: store => {
      sharedUpdater(
        store,
        user,
        Common.createOrderNodeForOptimisticUpdater(
          store,
          { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
          menuItemPrices,
          choiceItemPrices,
        ),
      );
    },
  });
};

export default commit;
