// @flow

import ServiceBase from './ServiceBase';
import { Tag } from '../schema';

export default class TagService extends ServiceBase {
  static buildSearchQuery = (criteria, queryAndParams) => {
    if (!criteria.has('conditions')) {
      return queryAndParams;
    }

    let newQueryAndParams = queryAndParams;

    return newQueryAndParams;
  };

  constructor(realm) {
    super(realm, Tag, TagService.buildSearchQuery, 'tag');
  }
}
