// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'TableState',
  properties: Map({
    key: 'string',
    name: 'MultiLanguagesString[]',
    imageUrl: 'string?',
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

    this.set('key', object.key);
    this.addMultiLanguagesStringValueFromObject(object, 'name');
    this.set('imageUrl', object.imageUrl);
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.set('key', info.get('key'));
    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.set('imageUrl', info.get('imageUrl'));
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList);
}
