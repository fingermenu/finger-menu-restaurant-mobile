// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, ChoiceItemPriceService } from '../../realmDB';

const choiceItemPriceLoaderById = new Dataloader(async ids => {
  const choiceItemPrices = await new ChoiceItemPriceService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => choiceItemPrices.find(choiceItemPrice => choiceItemPrice.get('id').localeCompare(id) === 0));
});

export default choiceItemPriceLoaderById;
