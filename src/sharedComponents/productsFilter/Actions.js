// @flow

import ActionTypes from './ActionTypes';

export function sortOptionChanged(payload) {
  return {
    type: ActionTypes.PRODUCTS_FILTER_SORT_OPTION_CHANGED,
    payload,
  };
}

export function categoriesFilterOptionChanged(payload) {
  return {
    type: ActionTypes.PRODUCTS_FILTER_CATEGORIES_CHANGED,
    payload,
  };
}

export function storesFilterOptionChanged(payload) {
  return {
    type: ActionTypes.PRODUCTS_FILTER_STORES_CHANGED,
    payload,
  };
}
