// @flow

import Immutable from 'immutable';
import cuid from 'cuid';

export default class ServiceBase {
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
