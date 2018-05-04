// @flow

import { Map, OrderedMap } from 'immutable';

export default Map({
  selectedLanguage: 'en_NZ',
  activeRestaurant: Map(),
  activeTable: Map(),
  activeCustomers: Map({ customers: OrderedMap(), activeCustomerId: null, numberOfAdults: 0, numberOfChildren: 0 }),
  activeMenu: Map(),
  activeMenuItemPrice: Map(),
  activeOrderMenuItemPrice: Map(),
  activeOrder: Map({ details: OrderedMap() }),
});
