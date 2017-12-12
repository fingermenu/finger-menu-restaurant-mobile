// @flow

import ActionTypes from './ActionTypes';

export function searchKeywordChanged(payload) {
  return {
    type: ActionTypes.STAPLE_ITEMS_SEARCH_KEYWORD_CHANGED,
    payload,
  };
}

export function stapleItemsAdded(payload) {
  return {
    type: ActionTypes.STAPLE_ITEMS_ITEMS_ADDED,
    payload,
  };
}

export function stapleItemSelectionChanged(payload) {
  return {
    type: ActionTypes.STAPLE_ITEMS_ITEM_SELECTION_CHANGED,
    payload,
  };
}
