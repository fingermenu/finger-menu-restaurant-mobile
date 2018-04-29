// @flow

import { commitMutation, graphql } from 'react-relay';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';
import Common from './Common';

const mutation = graphql`
  mutation UpdateOrderMutation($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
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

const commit = (
  environment,
  { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, paymentGroupId },
  menuItemPrices,
  choiceItemPrices,
  { onSuccess, onError } = {},
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
        details,
        paymentGroupId,
      },
    },
    optimisticResponse: {
      updateOrder: Common.createOrderOptimisticResponse(
        { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details },
        menuItemPrices,
        choiceItemPrices,
      ),
    },
    onCompleted: (response, errors) => {
      if (errors && errors.length > 0) {
        return;
      }

      if (!onSuccess) {
        return;
      }

      onSuccess(response.updateOrder.order.node);
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
