// @flow

import ActionTypes from './ActionTypes';

export function defaultShoppingListIdChanged(payload) {
  return {
    type: ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_ID_CHANGED,
    payload,
  };
}

export function defaultShoppingListNameChanged(payload) {
  return {
    type: ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_NAME_CHANGED,
    payload,
  };
}

export function defaultShoppingListTotalItemsCountChanged(payload) {
  return {
    type: ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_TOTAL_ITEMS_COUNT_CHANGED,
    payload,
  };
}

export function defaultShoppingListItemIdsChanged(payload) {
  return {
    type: ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_ITEM_IDS_CHANGED,
    payload,
  };
}
