// @flow

import ServiceBase from './ServiceBase';
import { Language } from '../schema';

export default class LanguageService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'key', 'key');
    newQueryAndParams = ServiceBase.addStringQuery(conditions, newQueryAndParams, 'name', 'nameLowerCase');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'imageUrl', 'imageUrl');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Language, LanguageService.buildSearchQuery, 'language');
  }
}
