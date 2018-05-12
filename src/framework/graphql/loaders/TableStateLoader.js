// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, TableStateService } from '../../realmDB';

export const tableStateLoaderByKey = new Dataloader(async keys => {
  const tableStateService = new TableStateService(realm);

  return Promise.all(keys.map(async key => (await tableStateService.search(Map({ conditions: Map({ key }) }))).first()));
});

export const tableStateLoaderById = new Dataloader(async ids => {
  const tableStates = await new TableStateService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => tableStates.find(tableState => tableState.get('id').localeCompare(id) === 0));
});
