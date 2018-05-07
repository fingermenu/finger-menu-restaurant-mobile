// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'Language',
  properties: Map({
    key: 'string',
    name: 'string?',
    imageUrl: 'string?',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class Language extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new Language();

    object.updateInfoInternal(info);

    return object;
  };

  constructor(object) {
    super(object);

    this.set('key', object.key);
    this.set('name', object.name);
    this.set('imageUrl', object.imageUrl);
  }

  updateInfoInternal = info => {
    this.updateInfoInternalBase(info);

    this.set('key', info.get('key'));
    this.set('name', info.get('name'));
    this.set('imageUrl', info.get('imageUrl'));
  };

  updateInfo = info => {
    Language.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => this.object;
}
