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
          details {
            menuItemPrice {
              menuItem {
                name
              }
            }
            quantity
            orderChoiceItemPrices {
              choiceItemPrice {
                choiceItem {
                  name
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

          const details = Immutable.fromJS(
            payload
              .getLinkedRecord('order')
              .getLinkedRecord('node')
              .getLinkedRecords('details'),
          ).map(detail => {
            const menuItemName = detail
              .getLinkedRecord('menuItemPrice')
              .getLinkedRecord('menuItem')
              .getValue('name');
            const quantity = detail.getValue('quantity');
            const orderChoiceItemPrices = Immutable.fromJS(detail.getLinkedRecords('orderChoiceItemPrices'));

            return Map({
              name: menuItemName,
              quantity,
              choiceItems: orderChoiceItemPrices.map(orderChoiceItemPrice => {
                const choiceItemName = orderChoiceItemPrice
                  .getLinkedRecord('choiceItemPrice')
                  .getLinkedRecord('choiceItem')
                  .getValue('name');
                const choiceItemQuantity = orderChoiceItemPrice.getValue('quantity');

                return Map({ name: choiceItemName, quantity: choiceItemQuantity });
              }),
            });
          });

          onSuccess(placedAt, details);
        }
      }
    },
  });
};

export default {
  commit,
};
