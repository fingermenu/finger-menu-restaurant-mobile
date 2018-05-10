// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'DishType',
  properties: Map({
    tagId: 'String',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class DishType extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new DishType();

    object.updateInfo(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    this.set('tagId', object.tagId);
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.set('tagId', info.get('tagId'));
  };

  getInfo = () => this.object;
}
