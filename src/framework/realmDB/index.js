// @flow

import Realm from 'realm';
import { DietaryOption, DishType, Language, MultiLanguagesString, ServingTime, Size, Tag } from './schema';

export { LanguageService, TagService } from './services';

export const realm = new Realm({
  schema: [
    MultiLanguagesString.getSchema(),
    DietaryOption.getSchema(),
    DishType.getSchema(),
    Language.getSchema(),
    ServingTime.getSchema(),
    Size.getSchema(),
    Tag.getSchema(),
  ],
  deleteRealmIfMigrationNeeded: true,
});
