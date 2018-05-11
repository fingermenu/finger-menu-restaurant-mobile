// @flow

import ServiceBase from './ServiceBase';
import { ChoiceItemPrice } from '../schema';

export default class ChoiceItemPriceService extends ServiceBase {
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
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'choiceItemId', 'choiceItemId');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, ChoiceItemPrice, ChoiceItemPriceService.buildSearchQuery, 'choice item price');
  }
}
