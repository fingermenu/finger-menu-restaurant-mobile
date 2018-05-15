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

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_CUSTOMERS: {
    const customerTypes = action.payload.get('customers').map(customer => customer.get('type'));
    const numberOfAdults = customerTypes.filter(type => type.localeCompare('A') === 0).count();
    const numberOfChildren = customerTypes.filter(type => type.localeCompare('C') === 0).count();

    return state
      .set('activeCustomers', action.payload)
      .setIn(['activeCustomers', 'numberOfAdults'], numberOfAdults)
      .setIn(['activeCustomers', 'numberOfChildren'], numberOfChildren);
  }

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_CUSTOMERS:
    return state.set('activeCustomers', Map({ customers: OrderedMap(), activeCustomerId: null, numberOfAdults: 0, numberOfChildren: 0 }));

  case ActionTypes.APPLICATION_STATE_ACTIVE_CUSTOMER_CHANGED:
    return state.setIn(['activeCustomers', 'activeCustomerId'], action.payload.get('customerId'));

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_MENU:
    return state.set('activeMenu', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_MENU:
    return state.set('activeMenu', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_MENU_ITEM_PRICE:
    return state.set('activeMenuItemPrice', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_MENU_ITEM_PRICE:
    return state.set('activeMenuItemPrice', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_ORDER_MENU_ITEM_PRICE:
    return state.set('activeOrderMenuItemPrice', action.payload);

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_ORDER_MENU_ITEM_PRICE:
    return state.set('activeOrderMenuItemPrice', Map());

  case ActionTypes.APPLICATION_STATE_SET_ACTIVE_ORDER_TOP_INFO:
    return state.update('activeOrder', activeOrder => activeOrder.merge(action.payload));

  case ActionTypes.APPLICATION_STATE_ADD_OR_UPDATE_ITEMS_TO_ACTIVE_ORDER:
    return state
      .updateIn(['activeOrder', 'details'], details =>
        details.filterNot(item => item.get('groupId').localeCompare(action.payload.get('groupId')) === 0),
      )
      .mergeIn(['activeOrder', 'details'], action.payload.get('items'));

  case ActionTypes.APPLICATION_STATE_REMOVE_ITEMS_FROM_ACTIVE_ORDER:
    return state.updateIn(['activeOrder', 'details'], details =>
      details.filterNot(item => item.get('groupId').localeCompare(action.payload.get('groupId')) === 0),
    );

  case ActionTypes.APPLICATION_STATE_CLEAR_ACTIVE_ORDER:
    return state.set('activeOrder', Map({ details: OrderedMap() }));

  default:
    return state;
  }
};
