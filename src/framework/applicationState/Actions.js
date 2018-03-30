// @flow

/* eslint-disable import/prefer-default-export */

import cuid from 'cuid';
import ActionTypes from './ActionTypes';

export function selectedLanguageChanged(selectedLanguage) {
  return {
    type: ActionTypes.APPLICATION_STATE_SELECTED_LANGUAGE_CHANGED,
    selectedLanguage,
  };
}

export function setActiveRestaurant(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_RESTAURANT,
    payload,
  };
}

export function clearActiveRestaurant() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_RESTAURANT,
  };
}

export function setActiveTable(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_TABLE,
    payload,
  };
}

export function clearActiveTable() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_TABLE,
  };
}

export function setActiveCustomer(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_CUSTOMER,
    payload,
  };
}

export function clearActiveCustomer() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_CUSTOMER,
  };
}

export function setActiveMenu(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_MENU,
    payload,
  };
}

export function clearActiveMenu() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_MENU,
  };
}

export function setActiveMenuItemPrice(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_MENU_ITEM_PRICE,
    payload,
  };
}

export function clearActiveMenuItemPrice() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_MENU_ITEM_PRICE,
  };
}

export function setActiveOrderMenuItemPrice(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_ORDER_MENU_ITEM_PRICE,
    payload,
  };
}

export function clearActiveOrderMenuItemPrice() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_ORDER_MENU_ITEM_PRICE,
  };
}

export function setActiveOrderTopInfo(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_ORDER_TOP_INFO,
    payload,
  };
}

export function addItemToActiveOrder(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_ADD_ITEM_TO_ACTIVE_ORDER,
    payload: payload.set('id', cuid()),
  };
}

export function updateItemInActiveOrder(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_UPDATE_ITEM_IN_ACTIVE_ORDER,
    payload,
  };
}

export function removeItemFromActiveOrder(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_REMOVE_ITEM_FROM_ACTIVE_ORDER,
    payload,
  };
}

export function clearActiveOrder() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_ORDER,
  };
}
