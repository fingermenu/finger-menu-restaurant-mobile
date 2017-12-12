// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_ID_CHANGED:
      return state.setIn(['defaultShoppingList', 'id'], action.payload.get('id'));

    case ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_NAME_CHANGED:
      return state.setIn(['defaultShoppingList', 'name'], action.payload.get('name'));

    case ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_TOTAL_ITEMS_COUNT_CHANGED:
      return state.setIn(['defaultShoppingList', 'totalItemsCount'], action.payload.get('totalItemsCount'));

    case ActionTypes.LOCAL_STATE_DEFAULT_SHOPPING_LIST_ITEM_IDS_CHANGED:
      return state.setIn(['defaultShoppingList', 'itemIds'], action.payload.get('itemIds'));

    default:
      return state;
  }
};
