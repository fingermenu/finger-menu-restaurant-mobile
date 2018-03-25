// @flow

import cuid from 'cuid';
import ActionTypes from './ActionTypes';

export function setOrder(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_SET_ORDER,
    payload,
  };
}

export function addOrderItem(payload) {
  return {
    type: ActionTypes.ORDERS_MENU_ADD_MENU_ITEM_PRICE,
    payload: payload.set('id', cuid()),
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

export function changeNotes(notes) {
  return {
    type: ActionTypes.ORDERS_MENU_CHANGE_NOTES,
    notes,
  };
}
