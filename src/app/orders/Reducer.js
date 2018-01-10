// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ORDERS_MENU_ORDER_CHANGED:
      return state.set('orders', action.payload.get('orders'));

    default:
      return state;
  }
};
