// @flow

import Realm from 'realm';
import { Language, MultiLanguagesString } from './schema';

export { LanguageService } from './services';

export const realm = new Realm({ schema: [MultiLanguagesString.getSchema(), Language.getSchema()] });
