// @flow

import ServiceBase from './ServiceBase';
import { Language } from '../schema';

export default class LanguageService extends ServiceBase {
  constructor(realm) {
    super(realm, Language, 'language');
  }
}
