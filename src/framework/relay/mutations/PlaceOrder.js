// @flow

import Immutable, { Map } from 'immutable';
import { commitMutation, graphql } from 'react-relay';
import { ZonedDateTime, ZoneId } from 'js-joda';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation PlaceOrderMutation($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      errorMessage
      order {
        __typename
        cursor
        node {
          placedAt
          notes
          customerName
          details {
            menuItemPrice {
              menuItem {
                nameToPrint
              }
            }
            quantity
            notes
            orderChoiceItemPrices {
              choiceItemPrice {
                choiceItem {
                  nameToPrint
                }
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

const commit = (
  environment,
  userId,
  { restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
  onSuccess,
) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
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
      const payload = store.getRootField('placeOrder');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, NotificationType.ERROR));
      } else {
        if (onSuccess) {
          const placedAt = ZonedDateTime.parse(
            payload
              .getLinkedRecord('order')
              .getLinkedRecord('node')
              .getValue('placedAt'),
          ).withZoneSameInstant(ZoneId.SYSTEM);

          const customerName = payload
            .getLinkedRecord('order')
            .getLinkedRecord('node')
            .getValue('customerName');
          const notes = payload
            .getLinkedRecord('order')
            .getLinkedRecord('node')
            .getValue('notes');

          const details = Immutable.fromJS(
            payload
              .getLinkedRecord('order')
              .getLinkedRecord('node')
              .getLinkedRecords('details'),
          ).map(detail => {
            const menuItemName = detail
              .getLinkedRecord('menuItemPrice')
              .getLinkedRecord('menuItem')
              .getValue('nameToPrint');
            const quantity = detail.getValue('quantity');
            const notes = detail.getValue('notes');
            const orderChoiceItemPrices = Immutable.fromJS(detail.getLinkedRecords('orderChoiceItemPrices'));

            return Map({
              name: menuItemName,
              quantity,
              notes,
              choiceItems: orderChoiceItemPrices.map(orderChoiceItemPrice => {
                const choiceItemName = orderChoiceItemPrice
                  .getLinkedRecord('choiceItemPrice')
                  .getLinkedRecord('choiceItem')
                  .getValue('nameToPrint');
                const choiceItemQuantity = orderChoiceItemPrice.getValue('quantity');

                return Map({ name: choiceItemName, quantity: choiceItemQuantity });
              }),
            });
          });

          onSuccess(Map({ placedAt, customerName, notes, details }));
        }
      }
    },
  });
};

export default {
  commit,
};
