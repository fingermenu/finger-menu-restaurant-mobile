// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, MenuService } from '../../realmDB';

const menuLoaderById = new Dataloader(async ids => {
  const menus = await new MenuService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => menus.find(menu => menu.get('id').localeCompare(id) === 0));
});

export default menuLoaderById;
