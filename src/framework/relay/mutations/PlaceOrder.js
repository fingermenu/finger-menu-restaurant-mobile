// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';
import Common from './Common';

const mutation = graphql`
  mutation PlaceOrderMutation($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
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
          placedAt
          cancelledAt
          details {
            id
            paymentGroupId
            paymentGroupDiscount
            paymentGroupDateTime
            quantity
            notes
            paid
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
            servingTime {
              id
              tag {
                nameToPrint
              }
            }
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

const sharedUpdater = (store, user, orderLinkedRecord, connectionFilters) => {
  if (!user) {
    return;
  }

  const userProxy = store.get(user.id);

  if (!userProxy) {
    return;
  }

  const connection = ConnectionHandler.getConnection(userProxy, 'User_orders', connectionFilters);

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeAfter(connection, orderLinkedRecord);
};

const commit = (
  environment,
  { restaurantId, correlationId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details },
  menuItemPrices,
  choiceItemPrices,
  connectionFilters = {},
  { user } = {},
  { onSuccess, onError } = {},
) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        restaurantId,
        correlationId,
        tableId,
        numberOfAdults,
        numberOfChildren,
        customerName,
        notes,
        details,
      },
    },
    updater: store => {
      sharedUpdater(store, user, store.getRootField('placeOrder').getLinkedRecord('order'), connectionFilters);
    },
    optimisticResponse: {
      placeOrder: Common.createOrderOptimisticResponse(
        { restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details },
        menuItemPrices,
        choiceItemPrices,
      ),
    },
    optimisticUpdater: store => {
      sharedUpdater(
        store,
        user,
        Common.createOrderNodeForOptimisticUpdater(
          store,
          { restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details },
          menuItemPrices,
          choiceItemPrices,
        ),
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

      onSuccess(response.placeOrder.order.node);
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
