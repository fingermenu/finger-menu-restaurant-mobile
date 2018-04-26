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
          totalPrice
          placedAt
          cancelledAt
          details {
            id
            printingGroupId
            printingDateTime
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
  { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice, printingGroupIds },
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
        totalPrice,
        details,
        printingGroupIds,
      },
    },
    optimisticResponse: {
      updateOrder: Common.createOrderOptimisticResponse(
        { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
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
