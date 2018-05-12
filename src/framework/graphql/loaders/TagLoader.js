// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, TagService } from '../../realmDB';

const tagLoaderById = new Dataloader(async ids => {
  const tags = await new TagService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => tags.find(tag => tag.get('id').localeCompare(id) === 0));
});

export default tagLoaderById;
