// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'Table',
  properties: Map({
    name: 'MultiLanguagesString[]',
    restaurantId: 'string',
    sortOrderIndex: 'int?',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class Table extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new Table();

    object.updateInfo(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    this.addMultiLanguagesStringValueFromObject(object, 'name');
    this.set('restaurantId', object.restaurantId);
    this.set('sortOrderIndex', object.sortOrderIndex);
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.set('restaurantId', info.get('restaurantId'));
    this.set('sortOrderIndex', info.get('sortOrderIndex'));
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList);
}
