// @flow

import ServiceBase from './ServiceBase';
import { Tag } from '../schema';

export default class TagService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name');
    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'description', 'description');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Tag, TagService.buildSearchQuery, 'tag');
  }
}
