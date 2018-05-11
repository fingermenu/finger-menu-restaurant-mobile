// @flow

import { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'MenuItemPrice',
  properties: Map({
    currentPrice: 'double?',
    wasPrice: 'double?',
    validFrom: 'date?',
    validUntil: 'date?',
    menuItemId: 'string',
    tagIds: 'string[]',
    toBeServedWithMenuItemPriceIds: 'string[]',
    choiceItemPriceIds: 'string[]',
    defaultChoiceItemPriceIds: 'string[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class MenuItemPrice extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new MenuItemPrice();

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
    this.set('menuItemId', object.menuItemId);
    this.set('tagIds', object.tagIds);
    this.set('toBeServedWithMenuItemPriceIds', object.toBeServedWithMenuItemPriceIds);
    this.set('choiceItemPriceIds', object.choiceItemPriceIds);
    this.set('defaultChoiceItemPriceIds', object.defaultChoiceItemPriceIds);
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.set('currentPrice', info.get('currentPrice'));
    this.set('wasPrice', info.get('wasPrice'));
    this.set('validFrom', info.get('validFrom'));
    this.set('validUntil', info.get('validUntil'));
    this.set('menuItemId', info.get('menuItemId'));
    this.set('tagIds', info.get('tagIds'));
    this.set('toBeServedWithMenuItemPriceIds', info.get('toBeServedWithMenuItemPriceIds'));
    this.set('choiceItemPriceIds', info.get('choiceItemPriceIds'));
    this.set('defaultChoiceItemPriceIds', info.get('defaultChoiceItemPriceIds'));
  };

  getInfo = () => this.object;
}
