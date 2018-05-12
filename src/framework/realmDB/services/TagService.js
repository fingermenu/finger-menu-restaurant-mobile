// @flow

import ServiceBase from './ServiceBase';
import { Tag } from '../schema';

export default class TagService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    const conditions = criteria.get('conditions');
    const language = criteria.get('language');
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'name', 'name', language);
    newQueryAndParams = ServiceBase.addMultiLanguagesStringQuery(conditions, newQueryAndParams, 'description', 'description', language);
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'level', 'level');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'forDisplay', 'forDisplay');
    newQueryAndParams = ServiceBase.addEqualityQuery(conditions, newQueryAndParams, 'parentTagId', 'parentTagId');

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Tag, TagService.buildSearchQuery, 'tag');
  }
}
