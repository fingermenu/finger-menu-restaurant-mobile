// @flow

import ActionTypes from './ActionTypes';

export function menuOrderChanged(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_ORDER_CHANGED,
    payload,
  };
}
