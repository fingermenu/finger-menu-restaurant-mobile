// @flow

import ServiceBase from './ServiceBase';
import { ServingTime } from '../schema';

export default class ServingTimeService extends ServiceBase {
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
    super(realm, ServingTime, ServingTimeService.buildSearchQuery, 'serving time');
  }
}
