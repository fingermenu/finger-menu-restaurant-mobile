// @flow

import { List, Map } from 'immutable';
import BaseObject from './BaseObject';
import MultiLanguagesString from './MultiLanguagesString';

const schema = Map({
  name: 'Tag',
  properties: Map({
    name: 'MultiLanguagesString[]',
    description: 'MultiLanguagesString[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class Tag extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new Tag();

    object.updateInfoInternal(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    /* this.set('key', object.key); */
  }

  updateInfoInternal = info => {
    this.updateInfoInternalBase(info);

    const name = info.get('name');

    if (name && !name.isEmpty()) {
      this.set('name', name.keySeq().map(language => new MultiLanguagesString(language, name.get(language)).getInfo()));
    } else if (name && name.isEmpty()) {
      this.set('name', List());
    }

    const description = info.get('description');

    if (description && !description.isEmpty()) {
      this.set('description', description.keySeq().map(language => new MultiLanguagesString(language, description.get(language)).getInfo()));
    } else if (description && description.isEmpty()) {
      this.set('description', List());
    }

    this.set('key', info.get('key'));
  };

  updateInfo = info => {
    this.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => this.object;
}
