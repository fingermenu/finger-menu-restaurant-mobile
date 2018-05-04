// @flow

import ActionTypes from './ActionTypes';

export function selectedLanguageChanged(selectedLanguage) {
  return {
    type: ActionTypes.APPLICATION_STATE_SELECTED_LANGUAGE_CHANGED,
    selectedLanguage,
  };
}

export function activeCustomerIdChanged(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_ACTIVE_CUSTOMER_CHANGED,
    payload,
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

export function setActiveCustomers(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_SET_ACTIVE_CUSTOMER,
    payload,
  };
}

export function clearActiveCustomers() {
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

export function addOrUpdateItemsInActiveOrder(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_ADD_OR_UPDATE_ITEMS_TO_ACTIVE_ORDER,
    payload,
  };
}

export function removeItemsFromActiveOrder(payload) {
  return {
    type: ActionTypes.APPLICATION_STATE_REMOVE_ITEMS_FROM_ACTIVE_ORDER,
    payload,
  };
}

export function clearActiveOrder() {
  return {
    type: ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_ORDER,
  };
}
