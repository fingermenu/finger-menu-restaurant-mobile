// @flow

import { Map } from 'immutable';

export default class BaseObject {
  static getBaseSchema = () => Map({ realmId: 'string', packageBundleChecksum: 'string', id: 'string', createdAt: 'date', updatedAt: 'date' });

  constructor(object) {
    this.object = Map({
      realmId: object.realmId,
      packageBundleChecksum: object.packageBundleChecksum,
      id: object.id,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    });
  }

  updateInfoInternalBase = info => {
    this.set('realmId', info.get('realmId'));
    this.set('packageBundleChecksum', info.get('packageBundleChecksum'));
    this.set('id', info.get('id'));
    this.set('createdAt', info.get('createdAt'));
    this.set('updatedAt', info.get('updatedAt'));
  };

  set = (key, value) => {
    this.object = this.object.set(key, value);
  };

  get = key => this.object[key];
}
