// @flow

import { Common } from '@microbusiness/common-javascript';
import Immutable, { List } from 'immutable';
import cuid from 'cuid';
import Query from './Query';

export default class ServiceBase {
  static addStandardCriteriaToQuery = ({ query, params }, criteria) => {
    let newParams = params;

    if (criteria.has('id')) {
      if (!criteria) {
        return query;
      }

      const objectId = criteria.get('id');

      if (objectId) {
        query.addAndQuery(`id = $${newParams.count()}`);
        newParams = newParams.push(objectId);
      }
    }

    if (criteria.has('ids')) {
      const objectIds = criteria.get('ids');

      if (objectIds && !objectIds.isEmpty()) {
        const innerQuery = objectIds
          .reduce((reduction, objectId) => {
            const resultQuery = reduction.addOrQuery(`id = $${newParams.count()}`);

            newParams = newParams.push(objectId);

            return resultQuery;
          }, new Query())
          .getQuery();

        query.addAndQuery(`(${innerQuery})`);
      }
    }

    return { query, params: newParams };
  };

  static addStringQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(conditionPropKey)) {
      const value = conditions.get(conditionPropKey);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} = $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    if (conditions.has(`startsWith_${conditionPropKey}`)) {
      const value = conditions.get(`startsWith_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} BEGINSWITH $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    if (conditions.has(`endsWith_${conditionPropKey}`)) {
      const value = conditions.get(`endsWith_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} ENDSWITH $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    if (conditions.has(`contains_${conditionPropKey}`)) {
      const value = conditions.get(`contains_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} CONTAINS $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    if (conditions.has(`contains_${conditionPropKey}s`)) {
      const values = conditions.get(`contains_${conditionPropKey}s`);

      if (Common.isNotUndefined(values) && !values.isEmpty()) {
        const innerQuery = values
          .reduce((reduction, value) => {
            const resultQuery = reduction.addAndQuery(`${columnName} = $${newParams.count()}`);

            newParams = newParams.push(value);

            return resultQuery;
          }, new Query())
          .getQuery();

        query.addAndQuery(`(${innerQuery})`);
      }
    }

    return { query, params: newParams };
  };

  static addDateTimeQuery = (conditions, queryAndParams, conditionPropKey, columnName) =>
    ServiceBase.addEqualityQuery(conditions, queryAndParams, conditionPropKey, columnName);

  static addNumberQuery = (conditions, queryAndParams, conditionPropKey, columnName) =>
    ServiceBase.addEqualityQuery(conditions, queryAndParams, conditionPropKey, columnName);

  static addEqualityQuery = (conditions, queryAndParams, conditionPropKey, columnName) => {
    let newQueryAndParams = queryAndParams;

    newQueryAndParams = ServiceBase.addEqualToQuery(conditions, newQueryAndParams, conditionPropKey, columnName);
    newQueryAndParams = ServiceBase.addNotEqualToQuery(conditions, newQueryAndParams, conditionPropKey, columnName);
    newQueryAndParams = ServiceBase.addLessThanToQuery(conditions, newQueryAndParams, conditionPropKey, columnName);
    newQueryAndParams = ServiceBase.addLessThanOrEqualToQuery(conditions, newQueryAndParams, conditionPropKey, columnName);
    newQueryAndParams = ServiceBase.addGreaterThanToQuery(conditions, newQueryAndParams, conditionPropKey, columnName);
    newQueryAndParams = ServiceBase.addGreaterThanOrEqualToQuery(conditions, newQueryAndParams, conditionPropKey, columnName);

    return newQueryAndParams;
  };

  static addEqualToQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(conditionPropKey)) {
      const value = conditions.get(conditionPropKey);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} = $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    return { query, params: newParams };
  };

  static addNotEqualToQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(`notEqual_${conditionPropKey}`)) {
      const value = conditions.get(`notEqual_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} <> $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    return { query, params: newParams };
  };

  static addLessThanToQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(`lessThan_${conditionPropKey}`)) {
      const value = conditions.get(`lessThan_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} < $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    return { query, params: newParams };
  };

  static addLessThanOrEqualToQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(`lessThanOrEqualTo_${conditionPropKey}`)) {
      const value = conditions.get(`lessThanOrEqualTo_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} <= $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    return { query, params: newParams };
  };

  static addGreaterThanToQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(`greaterThan_${conditionPropKey}`)) {
      const value = conditions.get(`greaterThan_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} > $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    return { query, params: newParams };
  };

  static addGreaterThanOrEqualToQuery = (conditions, { query, params }, conditionPropKey, columnName) => {
    let newParams = params;

    if (conditions.has(`greaterThanOrEqualTo_${conditionPropKey}`)) {
      const value = conditions.get(`greaterThanOrEqualTo_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} >= $${newParams.count()}`);
        newParams = newParams.push(value);
      }
    }

    return { query, params: newParams };
  };

  constructor(realm, Schema, buildSearchQueryFunc, objectFriendlyName) {
    this.realm = realm;
    this.Schema = Schema;
    this.SchemaName = this.Schema.getSchema().name;
    this.buildSearchQueryFunc = buildSearchQueryFunc;
    this.messagePrefix = `No ${objectFriendlyName} found with realmId: `;
  }

  create = async info =>
    new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          const realmId = cuid();

          this.realm.create(this.SchemaName, this.Schema.spawn(info.set('realmId', realmId)).getObject(), true);

          resolve(realmId);
        });
      } catch (error) {
        reject(error);
      }
    });

  read = async realmId =>
    new Promise((resolve, reject) => {
      const objects = this.realm.objects(this.SchemaName).filtered(`realmId = "${realmId}"`);

      if (objects.length === 0) {
        reject(this.messagePrefix + realmId);
      } else {
        resolve(new this.Schema(objects[0]).getInfo());
      }
    });

  delete = async realmId =>
    new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          const objects = this.realm.objects(this.SchemaName).filtered(`realmId = "${realmId}"`);

          this.realm.delete(objects);

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });

  search = async criteria =>
    new Promise(resolve => {
      if (this.shouldReturnEmptyResultSet(criteria)) {
        resolve(List());

        return;
      }

      const { query, params } = this.getQueryAndParams(criteria);
      let objects = this.realm.objects(this.SchemaName);

      if (!query.isQueryEmpty()) {
        objects = objects.filtered(query.getQueryStr(), ...params.toArray());
      }

      if (criteria.has('limit') && criteria.has('skip')) {
        const limit = criteria.get('limit');
        const skip = criteria.get('skip');

        objects = objects.slice(skip, skip + limit);
      }

      if (criteria.has('topMost')) {
        const topMost = criteria.get('topMost');

        if (topMost) {
          if (criteria.has('skip')) {
            const skip = criteria.get('skip');

            objects = objects.slice(skip, skip + 1);
          } else {
            objects = objects.slice(0, 1);
          }
        }
      }

      if (criteria.has('orderByFieldAscending')) {
        const value = criteria.get('orderByFieldAscending');

        if (value) {
          objects = objects.sorted(value, false);
        }
      }

      if (criteria.has('orderByFieldDescending')) {
        const value = criteria.get('orderByFieldDescending');

        if (value) {
          objects = objects.sorted(value, true);
        }
      }

      resolve(Immutable.fromJS(objects.map(item => new this.Schema(item).getInfo())));
    });

  count = async criteria =>
    new Promise(resolve => {
      if (this.shouldReturnEmptyResultSet(criteria)) {
        resolve(List());

        return;
      }

      const { query, params } = this.getQueryAndParams(criteria);
      let objects = this.realm.objects(this.SchemaName);

      if (!query.isQueryEmpty()) {
        objects = objects.filtered(query.getQueryStr(), ...params.toArray());
      }

      resolve(objects.length);
    });

  exists = async criteria => (await this.count(criteria)) > 0;

  getQueryAndParams = criteria => {
    let queryAndParams = { query: new Query(), params: List() };

    if (criteria.has('conditions')) {
      const conditions = criteria.get('conditions');

      queryAndParams = ServiceBase.addEqualityQuery(conditions, queryAndParams, 'realmId', 'realmId');
      queryAndParams = ServiceBase.addEqualityQuery(conditions, queryAndParams, 'packageBundleChecksum', 'packageBundleChecksum');
    }

    return this.buildSearchQueryFunc(criteria, queryAndParams);
  };

  shouldReturnEmptyResultSet = criteria => {
    if (criteria && criteria.has('ids')) {
      const objectIds = criteria.get('ids');

      if (objectIds && objectIds.isEmpty()) {
        return true;
      }
    }

    return false;
  };
}
