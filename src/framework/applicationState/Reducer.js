// @flow

import { Map, OrderedMap } from 'immutable';
import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.APPLICATION_STATE_SELECTED_LANGUAGE_CHANGED:
    return state.set('selectedLanguage', action.selectedLanguage);

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_RESTAURANT:
    return state.set('activeRestaurant', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_RESTAURANT:
    return state.set('activeRestaurant', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_TABLE:
    return state.set('activeTable', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_TABLE:
    return state.set('activeTable', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_CUSTOMER:
    return state.set('activeCustomer', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_CUSTOMER:
    return state.set('activeCustomer', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_MENU:
    return state.set('activeMenu', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_MENU:
    return state.set('activeMenu', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_MENU_ITEM_PRICE:
    return state.set('activeMenuItemPrice', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_MENU_ITEM_PRICE:
    return state.set('activeMenuItemPrice', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_ORDER_TOP_INFO:
    return state.update('activeOrder', activeOrder => activeOrder.merge(action.payload));

  case ActionTypes.APPLICATION_STATE_ADD_ITEM_TO_ACTIVE_ORDER:
  case ActionTypes.APPLICATION_STATE_UPDATE_ITEM_IN_ACTIVE_ORDER:
    return state.setIn(['activeOrder', 'details', action.payload.get('id')], action.payload);

  case ActionTypes.APPLICATION_STATE_REMOVE_ITEM_FROM_ACTIVE_ORDER:
    return state.deleteIn(['activeOrder', 'details', action.payload.get('id')]);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_ORDER:
    return state.set('activeOrder', Map({ details: OrderedMap() }));

  default:
    return state;
  }
};
