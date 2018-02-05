// @flow

import ActionTypes from './ActionTypes';
import uuid from 'uuid/v4';

export function setOrder(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_SET_ORDER,
    payload,
  };
}

export function addOrderItem(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_ADD_MENU_ITEM_PRICE,
    payload: payload.set('orderItemId', uuid()),
  };
}

export function removeOrderItem(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_REMOVE_MENU_ITEM_PRICE,
    payload,
  };
}

export function updateOrderItem(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_UPDATE_MENU_ITEM_PRICE,
    payload,
  };
}
