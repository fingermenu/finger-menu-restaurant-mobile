// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOPPING_LIST_DETAIL_SHOPPING_LIST_NAME_CHANGED: {
      let changedState = state.set('shoppingListId', action.payload.get('shoppingListId'));
      return changedState.set('shoppingListName', action.payload.get('shoppingListName'));
    }

    default:
      return state;
  }
};
