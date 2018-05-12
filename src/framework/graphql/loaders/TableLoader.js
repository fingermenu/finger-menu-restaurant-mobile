// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, TableService } from '../../realmDB';

const tableLoaderById = new Dataloader(async ids => {
  const tables = await new TableService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => tables.find(table => table.get('id').localeCompare(id) === 0));
});

export default tableLoaderById;
