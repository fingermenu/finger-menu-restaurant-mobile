// @flow

import ActionTypes from './ActionTypes';

export function searchKeywordChanged(payload) {
  return {
    type: ActionTypes.PRODUCTS_SEARCH_KEYWORD_CHANGED,
    payload,
  };
}

export function filterOptionChanged(payload) {
  return {
    type: ActionTypes.PRODUCTS_FILTER_OPTION_CHANGED,
    payload,
  };
}

export function productsSearchingModeChanged(payload) {
  return {
    type: ActionTypes.PRODUCTS_SEARCHING_MODE_CHANGED,
    payload,
  };
}
