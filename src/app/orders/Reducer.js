// @flow

import { Map } from 'immutable';
import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ORDERS_MENU_SET_ORDER:
    return state.set(
      'tableOrder',
      Map({
        details: Map(),
        restaurantId: action.payload.get('restaurantId'),
        tableId: action.payload.get('tableId'),
        customerName: action.payload.get('customerName'),
        notes: action.payload.get('notes'),
        numberOfAdults: action.payload.get('numberOfAdults'),
        numberOfChildren: action.payload.get('numberOfChildren'),
      }),
    );

  case ActionTypes.ORDERS_MENU_ADD_MENU_ITEM_PRICE:
    return state.setIn(['tableOrder', 'details', action.payload.get('orderItemId')], action.payload.delete('orderItemId'));

  case ActionTypes.ORDERS_MENU_REMOVE_MENU_ITEM_PRICE:
    return state.deleteIn(['tableOrder', 'details', action.payload.get('orderItemId')]);

  case ActionTypes.ORDERS_MENU_UPDATE_MENU_ITEM_PRICE:
    return state.setIn(['tableOrder', 'details', action.payload.get('orderItemId')], action.payload.delete('orderItemId'));

  default:
    return state;
  }
};
