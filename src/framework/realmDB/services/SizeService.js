// @flow

import ServiceBase from './ServiceBase';
import { Size } from '../schema';

export default class SizeService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'tagId', 'tagId');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Size, SizeService.buildSearchQuery, 'size');
  }
}
