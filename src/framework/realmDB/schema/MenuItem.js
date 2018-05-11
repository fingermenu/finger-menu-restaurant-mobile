// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'MenuItem',
  properties: Map({
    name: 'MultiLanguagesString[]',
    description: 'MultiLanguagesString[]',
    menuItemPageUrl: 'string?',
    imageUrl: 'string?',
    tagIds: 'string[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class MenuItem extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new MenuItem();

    object.updateInfo(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    this.addMultiLanguagesStringValueFromObject(object, 'name');
    this.addMultiLanguagesStringValueFromObject(object, 'description');
    this.set('menuItemPageUrl', object.menuItemPageUrl);
    this.set('imageUrl', object.imageUrl);
    this.set('tagIds', object.tagIds);
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'description');
    this.set('menuItemPageUrl', info.get('menuItemPageUrl'));
    this.set('imageUrl', info.get('imageUrl'));
    this.set('tagIds', info.get('tagIds'));
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList).update('description', this.reduceMultiLanguagesStringList);
}
