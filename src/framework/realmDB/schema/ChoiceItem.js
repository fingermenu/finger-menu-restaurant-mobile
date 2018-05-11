// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'ChoiceItem',
  properties: Map({
    name: 'MultiLanguagesString[]',
    description: 'MultiLanguagesString[]',
    choiceItemPageUrl: 'string?',
    imageUrl: 'string?',
    tagIds: 'string[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class ChoiceItem extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new ChoiceItem();

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
    this.set('choiceItemPageUrl', object.choiceItemPageUrl);
    this.set('imageUrl', object.imageUrl);
    this.set('tagIds', object.tagIds);
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'description');
    this.set('choiceItemPageUrl', info.get('choiceItemPageUrl'));
    this.set('imageUrl', info.get('imageUrl'));
    this.set('tagIds', info.get('tagIds'));
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList).update('description', this.reduceMultiLanguagesStringList);
}
