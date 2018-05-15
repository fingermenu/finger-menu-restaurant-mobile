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
          customers {
            customerId
            name
            type
          }
          notes
          placedAt
          cancelledAt
          details {
            orderMenuItemPriceId
            paymentGroup {
              paymentGroupId
              discount
              paidAt
            }
            quantity
            notes
            customer {
              customerId
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
                nameToPrintOnCustomerReceipt
                nameToPrintOnKitchenReceipt
                description
              }
            }
            servingTime {
              id
              tag {
                nameToPrintOnCustomerReceipt
                nameToPrintOnKitchenReceipt
              }
            }
            orderChoiceItemPrices {
              orderChoiceItemPriceId
              notes
              quantity
              paid
              choiceItemPrice {
                id
                currentPrice
                choiceItem {
                  id
                  name
                  nameToPrintOnCustomerReceipt
                  nameToPrintOnKitchenReceipt
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
  { id, restaurantId, notes, tableId, details, customers, paymentGroupId },
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
        notes,
        details,
        customers,
        paymentGroupId,
      },
    },
    optimisticResponse: {
      updateOrder: Common.createOrderOptimisticResponse({ id, restaurantId, notes, tableId, details, customers }, menuItemPrices, choiceItemPrices),
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
