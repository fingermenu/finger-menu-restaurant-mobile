// @flow

import Immutable, { Map } from 'immutable';
import BaseObject from './BaseObject';
import Rules from './Rules';

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
    rules: 'Rules?',
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
    this.set('tagIds', Immutable.fromJS(object.tagIds));
    this.set('toBeServedWithMenuItemPriceIds', Immutable.fromJS(object.toBeServedWithMenuItemPriceIds));
    this.set('choiceItemPriceIds', Immutable.fromJS(object.choiceItemPriceIds));
    this.set('defaultChoiceItemPriceIds', Immutable.fromJS(object.defaultChoiceItemPriceIds));
    this.set('rules', new Rules(object.rules).getInfo());
    this.addSortOrderIndexValueFromObject(object, 'toBeServedWithMenuItemPriceSortOrderIndices');
    this.addSortOrderIndexValueFromObject(object, 'choiceItemPriceSortOrderIndices');
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
    this.set('rules', info.get('rules'));
    this.addSortOrderIndexValueFromImmutableInfo(info, 'toBeServedWithMenuItemPriceSortOrderIndices');
    this.addSortOrderIndexValueFromImmutableInfo(info, 'choiceItemPriceSortOrderIndices');
  };

  getInfo = () =>
    this.object
      .update('toBeServedWithMenuItemPriceSortOrderIndices', this.reduceSortOrderIndexList)
      .update('choiceItemPriceSortOrderIndices', this.reduceSortOrderIndexList);
}
