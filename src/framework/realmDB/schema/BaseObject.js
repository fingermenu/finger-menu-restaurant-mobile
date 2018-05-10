// @flow

import { List, Map } from 'immutable';
import MultiLanguagesString from './MultiLanguagesString';

export default class BaseObject {
  static getBaseSchema = () => Map({ realmId: 'string', packageBundleChecksum: 'string', id: 'string' });

  constructor(object) {
    if (!object) {
      this.object = Map();

      return;
    }

    this.object = Map({
      realmId: object.realmId,
      packageBundleChecksum: object.packageBundleChecksum,
      id: object.id,
    });
  }

  updateInfoBase = info => {
    this.set('realmId', info.get('realmId'));
    this.set('packageBundleChecksum', info.get('packageBundleChecksum'));
    this.set('id', info.get('id'));
  };

  set = (key, value) => {
    this.object = this.object.set(key, value);
  };

  get = key => this.object[key];

  getObject = () => this.object.toJS();

  addMultiLanguagesStringValueFromObject = (object, columnName) => {
    this.set(columnName, object[columnName].map(_ => new MultiLanguagesString(_.language, _.value).getInfo()));
  };

  addMultiLanguagesStringValueFromImmutableInfo = (info, columnName) => {
    const value = info.get(columnName);

    if (value && !value.isEmpty()) {
      this.set(columnName, value.keySeq().map(language => new MultiLanguagesString(language, value.get(language)).getInfo()));
    } else if (value && value.isEmpty()) {
      this.set(columnName, List());
    }
  };

  reduceMultiLanguagesStringList = list =>
    list.reduce((reduction, languageAndValue) => reduction.set(languageAndValue.get('language'), languageAndValue.get('value')));
}
