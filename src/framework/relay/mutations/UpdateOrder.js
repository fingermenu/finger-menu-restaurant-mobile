// @flow

import { commitMutation, graphql } from 'react-relay';
import { NotificationType } from '@microbusiness/common-react';
import * as messageBarActions from '@microbusiness/common-react/src/notification/Actions';
import { reduxStore } from '../../../app/navigation';
import Common from './Common';
import packageInfo from '../../../../package.json';

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
        appVersion: packageInfo.version,
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
