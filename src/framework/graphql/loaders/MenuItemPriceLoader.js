// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, MenuItemPriceService } from '../../realmDB';

const menuItemPriceLoaderById = new Dataloader(async ids => {
  const menuItemPrices = await new MenuItemPriceService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => menuItemPrices.find(menuItemPrice => menuItemPrice.get('id').localeCompare(id) === 0));
});

export default menuItemPriceLoaderById;
