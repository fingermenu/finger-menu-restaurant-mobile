// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, DishTypeService } from '../../realmDB';

const dishTypeLoaderById = new Dataloader(async ids => {
  const dishTypes = await new DishTypeService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => dishTypes.find(dishType => dishType.get('id').localeCompare(id) === 0));
});

export default dishTypeLoaderById;
