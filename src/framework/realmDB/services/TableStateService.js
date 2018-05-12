// @flow

import ServiceBase from './ServiceBase';
import { TableState } from '../schema';

export default class TableStateService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    const language = criteria.get('language');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'key', 'key');
    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name', language);
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'imageUrl', 'imageUrl');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, TableState, TableStateService.buildSearchQuery, 'table state');
  }
}
