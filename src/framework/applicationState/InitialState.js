// @flow

import { Map, OrderedMap } from 'immutable';

export default Map({
  selectedLanguage: 'en_NZ',
  activeRestaurant: Map(),
  activeTable: Map(),
  activeCustomer: Map(),
  activeMenu: Map(),
  activeMenuItemPrice: Map(),
  activeOrder: Map({ items: OrderedMap() }),
});
