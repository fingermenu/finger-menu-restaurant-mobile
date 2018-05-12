// @flow

import ServiceBase from './ServiceBase';
import { Table } from '../schema';

export default class TableService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    const language = criteria.get('language');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name', language);
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'restaurantId', 'restaurantId');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'sortOrderIndex', 'sortOrderIndex');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Table, TableService.buildSearchQuery, 'table');
  }
}
