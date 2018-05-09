// @flow

import Realm from 'realm';
import { Language, MultiLanguagesString, Tag } from './schema';

export { LanguageService, TagService } from './services';

export const realm = new Realm({
  schema: [MultiLanguagesString.getSchema(), Language.getSchema(), Tag.getSchema()],
  deleteRealmIfMigrationNeeded: true,
});
