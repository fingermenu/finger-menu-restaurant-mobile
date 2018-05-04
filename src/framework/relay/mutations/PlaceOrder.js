// @flow

import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';
import Common from './Common';
import packageInfo from '../../../../package.json';

const mutation = graphql`
  mutation PlaceOrderMutation($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      order {
        __typename
        cursor
        node {
          id
          correlationId
          customers {
            id
            name
            type
          }
          notes
          placedAt
          cancelledAt
          details {
            id
            paymentGroup {
              id
              discount
              paidAt
            }
            quantity
            notes
            customer {
              id
              name
              type
            }
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
  { restaurantId, correlationId, notes, tableId, details, customers },
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
        appVersion: packageInfo.version,
        restaurantId,
        correlationId,
        tableId,
        notes,
        details,
        customers,
      },
    },
    updater: store => {
      sharedUpdater(store, user, store.getRootField('placeOrder').getLinkedRecord('order'), connectionFilters);
    },
    optimisticResponse: {
      placeOrder: Common.createOrderOptimisticResponse({ restaurantId, notes, tableId, details, customers }, menuItemPrices, choiceItemPrices),
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
