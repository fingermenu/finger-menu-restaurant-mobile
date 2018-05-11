// @flow

import ServiceBase from './ServiceBase';
import { MenuItemPrice } from '../schema';

export default class MenuItemPriceService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'currentPrice', 'currentPrice');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'wasPrice', 'wasPrice');
    newQueryAndParams = ServiceBase.addDateTimeQuery(conditions, newQueryAndParams, 'validFrom', 'validFrom');
    newQueryAndParams = ServiceBase.addDateTimeQuery(conditions, newQueryAndParams, 'validUntil', 'validUntil');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'menuItemId', 'menuItemId');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, MenuItemPrice, MenuItemPriceService.buildSearchQuery, 'choice item price');
  }
}
