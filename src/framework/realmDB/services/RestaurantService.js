// @flow

import ServiceBase from './ServiceBase';
import { Restaurant } from '../schema';

export default class RestaurantService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    const language = criteria.get('language');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name', language);
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'websiteUrl', 'websiteUrl');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'pin', 'pin');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Restaurant, RestaurantService.buildSearchQuery, 'restaurant');
  }
}
