// @flow

import Immutable, { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'ChoiceItemPrice',
  properties: Map({
    currentPrice: 'double?',
    wasPrice: 'double?',
    validFrom: 'date?',
    validUntil: 'date?',
    choiceItemId: 'string',
    tagIds: 'string[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class ChoiceItemPrice extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new ChoiceItemPrice();

    object.updateInfo(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    this.set('currentPrice', object.currentPrice);
    this.set('wasPrice', object.wasPrice);
    this.set('validFrom', object.validFrom);
    this.set('validUntil', object.validUntil);
    this.set('choiceItemId', object.choiceItemId);
    this.set('tagIds', Immutable.fromJS(object.tagIds));
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.set('currentPrice', info.get('currentPrice'));
    this.set('wasPrice', info.get('wasPrice'));
    this.set('validFrom', info.get('validFrom'));
    this.set('validUntil', info.get('validUntil'));
    this.set('choiceItemId', info.get('choiceItemId'));
    this.set('tagIds', info.get('tagIds'));
  };

  getInfo = () => this.object;
}
