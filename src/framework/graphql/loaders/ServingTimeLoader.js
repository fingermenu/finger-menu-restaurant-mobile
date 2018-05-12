// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, ServingTimeService } from '../../realmDB';

const servingTimeLoaderById = new Dataloader(async ids => {
  const servingTimes = await new ServingTimeService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => servingTimes.find(servingTime => servingTime.get('id').localeCompare(id) === 0));
});

export default servingTimeLoaderById;
