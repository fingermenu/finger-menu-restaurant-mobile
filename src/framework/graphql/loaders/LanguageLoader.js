// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, LanguageService } from '../../realmDB';

export const languageLoaderByKey = new Dataloader(async keys => {
  const languageService = new LanguageService(realm);

  return Promise.all(keys.map(async key => languageService.search(Map({ conditions: Map({ key }) })).first()));
});

export const languageLoaderById = new Dataloader(async ids => {
  const languages = await new LanguageService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => languages.find(language => language.get('id').localeCompare(id) === 0));
});
