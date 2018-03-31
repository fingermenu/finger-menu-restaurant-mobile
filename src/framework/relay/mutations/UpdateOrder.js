// @flow

import cuid from 'cuid';
import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation UpdateOrderMutation($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      errorMessage
      order {
        __typename
        cursor
        node {
          id
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

const sharedUpdater = (store, userId, ordersEdge) => {
  const userProxy = store.get(userId);
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
  userId,
  { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
  menuItemPrices,
  choiceItemPrices,
  onSuccess,
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
      const payload = store.getRootField('updateOrder');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, NotificationType.ERROR));
      } else {
        const orderEdge = payload.getLinkedRecord('order');

        sharedUpdater(store, userId, orderEdge);

        if (onSuccess) {
          onSuccess();
        }
      }
    },
    optimisticUpdater: store => {
      const id = cuid();
      const node = store.create(id, 'item');

      node.setValue(id, 'id');
      node.setValue(tableId, 'tableId');
      node.setValue(restaurantId, 'restaurantId');
      node.setValue(numberOfAdults, 'numberOfAdults');
      node.setValue(numberOfChildren, 'numberOfChildren');
      node.setValue(customerName, 'customerName');
      node.setValue(notes, 'notes');
      node.setValue(totalPrice, 'totalPrice');

      const detailItemsLinkedRecords = details.map(({ id, quantity, notes, paid, menuItemPriceId, orderChoiceItemPrices }) => {
        const detailItemLinkedRecord = store.create(cuid(), 'detailItem');

        detailItemLinkedRecord.setValue(id, 'id');
        detailItemLinkedRecord.setValue(quantity, 'quantity');
        detailItemLinkedRecord.setValue(notes, 'notes');
        detailItemLinkedRecord.setValue(paid, 'paid');

        const foundMenuItemPrice = menuItemPrices.find(menuItemPrice => menuItemPrice.get('id').localeCompare(menuItemPriceId) === 0);
        const menuItemPriceLinkedRecord = store.create(cuid(), 'menuItemPrice');

        menuItemPriceLinkedRecord.setValue(menuItemPriceId, 'id');
        menuItemPriceLinkedRecord.setValue(foundMenuItemPrice.get('currentPrice'), 'currentPrice');

        const menuItemLinkedRecord = store.create(cuid(), 'menuItem');

        menuItemLinkedRecord.setValue(menuItemPriceId, 'id');
        menuItemLinkedRecord.setValue(foundMenuItemPrice.getIn(['menuItem', 'name']), 'name');
        menuItemLinkedRecord.setValue(foundMenuItemPrice.getIn(['menuItem', 'description']), 'description');

        const choiceItemPricesLinkedRecords = orderChoiceItemPrices.map(
          ({
            id: orderChoiceItemPriceId,
            quantity: choiceItemPriceQuantity,
            notes: choiceItemPriceNotes,
            paid: choiceItemPricePaid,
            choiceItemPriceId,
          }) => {
            const foundChoiceItemPrice = choiceItemPrices.find(choiceItemPrice => choiceItemPrice.get('id').localeCompare(choiceItemPriceId) === 0);
            const orderChoiceItemPriceLinkedRecord = store.create(cuid(), 'orderChoiceItemPrice');

            orderChoiceItemPriceLinkedRecord.setValue(orderChoiceItemPriceId, 'id');
            orderChoiceItemPriceLinkedRecord.setValue(foundChoiceItemPrice.get('currentPrice'), 'currentPrice');
            orderChoiceItemPriceLinkedRecord.setValue(choiceItemPricePaid, 'paid');
            orderChoiceItemPriceLinkedRecord.setValue(choiceItemPriceQuantity, 'quantity');
            orderChoiceItemPriceLinkedRecord.setValue(choiceItemPriceNotes, 'notes');

            const choiceItemLinkedRecord = store.create(cuid(), 'choiceItem');

            choiceItemLinkedRecord.setValue(choiceItemPriceId, 'id');
            choiceItemLinkedRecord.setValue(foundChoiceItemPrice.getIn(['choiceItem', 'name']), 'name');
            choiceItemLinkedRecord.setValue(foundChoiceItemPrice.getIn(['choiceItem', 'description']), 'description');

            orderChoiceItemPriceLinkedRecord.setLinkedRecord(choiceItemLinkedRecord, 'choiceItem');

            return orderChoiceItemPriceLinkedRecord;
          },
        );

        menuItemPriceLinkedRecord.setLinkedRecords(choiceItemPricesLinkedRecords, 'choiceItemPrices');
        menuItemPriceLinkedRecord.setLinkedRecord(menuItemLinkedRecord, 'menuItem');
        detailItemLinkedRecord.setLinkedRecord(menuItemPriceLinkedRecord, 'menuItemPrice');

        return detailItemLinkedRecord;
      });

      node.setLinkedRecords(detailItemsLinkedRecords, 'details');

      const ordersEdge = store.create(cuid(), 'ordersEdge');

      ordersEdge.setLinkedRecord(node, 'node');
      sharedUpdater(store, userId, ordersEdge);
    },
  });
};

export default {
  commit,
};
