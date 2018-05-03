// @flow

import { Map, OrderedMap } from 'immutable';

export default Map({
  selectedLanguage: 'en_NZ',
  activeRestaurant: Map(),
  activeTable: Map(),
  activeCustomers: Map(),
  activeMenu: Map(),
  activeMenuItemPrice: Map(),
  activeOrderMenuItemPrice: Map(),
  activeOrder: Map({ items: OrderedMap() }),
});
