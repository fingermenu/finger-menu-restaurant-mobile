// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'TableState',
  properties: Map({
    name: 'MultiLanguagesString[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class TableState extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new TableState();

    object.updateInfo(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    this.addMultiLanguagesStringValueFromObject(object, 'name');
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList);
}
