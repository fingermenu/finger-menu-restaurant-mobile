// @flow

import Realm from 'realm';
import { Language } from './schema';

export { LanguageService } from './services';

export const realm = new Realm({ schema: [Language] });
