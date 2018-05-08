// @flow

import { Common } from '@microbusiness/common-javascript';
import Immutable from 'immutable';
import cuid from 'cuid';
import Query from './Query';

export default class ServiceBase {
  static addStandardCriteriaToQuery = (query, criteria) => {
    if (criteria.has('id')) {
      if (!criteria) {
        return query;
      }

      const objectId = criteria.get('id');

      if (objectId) {
        query.addAndQuery(`id = "${objectId}"`);
      }
    }

    if (criteria.has('ids')) {
      const objectIds = criteria.get('ids');

      if (objectIds && !objectIds.isEmpty()) {
        const innerQuery = objectIds.reduce((reduction, objectId) => reduction.addOrQuery(`id = "${objectId}"`), new Query()).getQuery();

        query.addAndQuery(`(${innerQuery})`);
      }
    }

    return query;
  };

  static addStringQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(conditionPropKey)) {
      const value = conditions.get(conditionPropKey);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} = "${value}"`);
      }
    }

    if (conditions.has(`startsWith_${conditionPropKey}`)) {
      const value = conditions.get(`startsWith_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} BEGINSWITH "${value}"`);
      }
    }

    if (conditions.has(`endsWith_${conditionPropKey}`)) {
      const value = conditions.get(`endsWith_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} ENDSWITH "${value}"`);
      }
    }

    if (conditions.has(`contains_${conditionPropKey}`)) {
      const value = conditions.get(`contains_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} CONTAINS "${value}"`);
      }
    }

    if (conditions.has(`contains_${conditionPropKey}s`)) {
      const values = conditions.get(`contains_${conditionPropKey}s`);

      if (Common.isNotUndefined(values) && !values.isEmpty()) {
        const innerQuery = values.reduce((reduction, value) => reduction.addAndQuery(`${columnName} = "${value}"`), new Query()).getQuery();

        query.addAndQuery(`(${innerQuery})`);
      }
    }

    return query;
  };

  static addEqualToQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(conditionPropKey)) {
      const value = conditions.get(conditionPropKey);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} = "${value}"`);
      }
    }

    return query;
  };

  static addNotEqualToQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(`notEqual_${conditionPropKey}`)) {
      const value = conditions.get(`notEqual_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.addAndQuery(`${columnName} <> "${value}"`);
      }
    }

    return query;
  };

  static addLessThanToQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(`lessThan_${conditionPropKey}`)) {
      const value = conditions.get(`lessThan_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.lessThan(columnName, value);
      }
    }

    return query;
  };

  static addLessThanOrEqualToQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(`lessThanOrEqualTo_${conditionPropKey}`)) {
      const value = conditions.get(`lessThanOrEqualTo_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.lessThanOrEqualTo(columnName, value);
      }
    }

    return query;
  };

  static addGreaterThanToQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(`greaterThan_${conditionPropKey}`)) {
      const value = conditions.get(`greaterThan_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.greaterThan(columnName, value);
      }
    }

    return query;
  };

  static addGreaterThanOrEqualToQuery = (conditions, query, conditionPropKey, columnName) => {
    if (conditions.has(`greaterThanOrEqualTo_${conditionPropKey}`)) {
      const value = conditions.get(`greaterThanOrEqualTo_${conditionPropKey}`);

      if (Common.isNotUndefined(value)) {
        query.greaterThanOrEqualTo(columnName, value);
      }
    }

    return query;
  };

  constructor(realm, Schema, objectFriendlyName) {
    this.realm = realm;
    this.Schema = Schema;
    this.SchemaName = this.Schema.getSchema().name;
    this.messagePrefix = `No ${objectFriendlyName} found with realmId: `;
  }

  create = async info =>
    new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          const realmId = cuid();

          this.realm.create(this.SchemaName, info.set('realmId', realmId).toJS(), true);

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

  search = async () =>
    new Promise(resolve => {
      const objects = this.realm.objects(this.SchemaName).map(item => new this.Schema(item).getInfo());

      resolve(Immutable.fromJS(objects));
    });
}
