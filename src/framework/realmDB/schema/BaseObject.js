// @flow

import { List, Map } from 'immutable';
import MultiLanguagesString from './MultiLanguagesString';
import SortOrderIndex from './SortOrderIndex';

export default class BaseObject {
  static getBaseSchema = () => Map({ realmId: 'string', packageBundleChecksum: 'string', id: 'string', createdAt: 'date' });

  constructor(object) {
    if (!object) {
      this.object = Map();

      return;
    }

    this.object = Map({
      realmId: object.realmId,
      packageBundleChecksum: object.packageBundleChecksum,
      id: object.id,
      createdAt: object.createdAt,
    });
  }

  updateInfoBase = info => {
    this.set('realmId', info.get('realmId'));
    this.set('packageBundleChecksum', info.get('packageBundleChecksum'));
    this.set('id', info.get('id'));
    this.set('createdAt', info.get('createdAt'));
  };

  set = (key, value) => {
    this.object = this.object.set(key, value);
  };

  get = key => this.object[key];

  getObject = () => this.object.toJS();

  addMultiLanguagesStringValueFromObject = (object, columnName) => {
    this.set(columnName, object[columnName].map(_ => new MultiLanguagesString(_).getInfo()));
  };

  addMultiLanguagesStringValueFromImmutableInfo = (info, columnName) => {
    const value = info.get(columnName);

    if (value && !value.isEmpty()) {
      this.set(columnName, value.keySeq().map(language => new MultiLanguagesString({ language, value: value.get(language) }).getInfo()));
    } else if (value && value.isEmpty()) {
      this.set(columnName, List());
    }
  };

  addSortOrderIndexValueFromObject = (object, columnName) => {
    this.set(columnName, object[columnName].map(_ => new SortOrderIndex(_).getInfo()));
  };

  addSortOrderIndexValueFromImmutableInfo = (info, columnName) => {
    const value = info.get(columnName);

    if (value && !value.isEmpty()) {
      this.set(columnName, value.keySeq().map(id => new SortOrderIndex({ id, index: value.get(id) }).getInfo()));
    } else if (value && value.isEmpty()) {
      this.set(columnName, List());
    }
  };

  reduceMultiLanguagesStringList = list =>
    list.reduce((reduction, languageAndValue) => reduction.set(languageAndValue.get('language'), languageAndValue.get('value')), Map());

  reduceSortOrderIndexList = list => list.reduce((reduction, idAndIndex) => reduction.set(idAndIndex.get('id'), idAndIndex.get('index')), Map());
}
