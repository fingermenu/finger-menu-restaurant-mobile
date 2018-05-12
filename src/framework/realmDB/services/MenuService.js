// @flow

import ServiceBase from './ServiceBase';
import { Menu } from '../schema';

export default class MenuService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    const language = criteria.get('language');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name', language);
    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'description', 'description', language);
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'menuPageUrl', 'menuPageUrl');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'imageUrl', 'imageUrl');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Menu, MenuService.buildSearchQuery, 'menu');
  }
}
