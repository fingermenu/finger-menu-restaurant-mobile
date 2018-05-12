// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, ChoiceItemService } from '../../realmDB';

const choiceItemLoaderById = new Dataloader(async ids => {
  const choiceItems = await new ChoiceItemService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => choiceItems.find(choiceItem => choiceItem.get('id').localeCompare(id) === 0));
});

export default choiceItemLoaderById;
