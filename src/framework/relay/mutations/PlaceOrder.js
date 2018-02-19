// @flow

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

          onSuccess(placedAt);
        }
      }
    },
  });
};

export default {
  commit,
};
