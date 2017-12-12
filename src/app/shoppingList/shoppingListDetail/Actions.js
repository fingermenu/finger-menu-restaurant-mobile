// @flow

import ActionTypes from './ActionTypes';

export function shoppingListNameChanged(payload) {
  return {
    type: ActionTypes.SHOPPING_LIST_DETAIL_SHOPPING_LIST_NAME_CHANGED,
    payload,
  };
}
