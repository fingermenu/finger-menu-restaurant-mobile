// @flow

import ServiceBase from './ServiceBase';
import { Language } from '../schema';
import Query from './Query';

export default class LanguageService extends ServiceBase {
  static buildSearchQuery = criteria => {
    const query = new Query();

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    ServiceBase.addStringQuery(conditions, query, 'key', 'key');
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'imageUrl', 'imageUrl');

    return query;
  };

  constructor(realm) {
    super(realm, Language, LanguageService.buildSearchQuery, 'language');
  }
}
