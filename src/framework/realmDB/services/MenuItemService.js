// @flow

import ServiceBase from './ServiceBase';
import { MenuItem } from '../schema';

export default class MenuItemService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    const language = criteria.get('language');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name', language);
    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'description', 'description', language);
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'menuItemPageUrl', 'menuItemPageUrl');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'imageUrl', 'imageUrl');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, MenuItem, MenuItemService.buildSearchQuery, 'choice item');
  }
}
