// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'DietaryOption',
  properties: Map({
    tagId: 'string',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class DietaryOption extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new DietaryOption();

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
