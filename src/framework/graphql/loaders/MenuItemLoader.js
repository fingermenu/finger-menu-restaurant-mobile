// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, MenuItemService } from '../../realmDB';

const menuItemLoaderById = new Dataloader(async ids => {
  const menuItems = await new MenuItemService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => menuItems.find(menuItem => menuItem.get('id').localeCompare(id) === 0));
});

export default menuItemLoaderById;
