// @flow

import Immutable, { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'Menu',
  properties: Map({
    name: 'MultiLanguagesString[]',
    description: 'MultiLanguagesString[]',
    menuPageUrl: 'string?',
    imageUrl: 'string?',
    tagIds: 'string[]',
    menuItemPriceIds: 'string[]',
    menuItemPriceSortOrderIndices: 'SortOrderIndex[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class Menu extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new Menu();

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
    this.set('menuPageUrl', object.menuPageUrl);
    this.set('imageUrl', object.imageUrl);
    this.set('tagIds', Immutable.fromJS(object.tagIds.map(_ => _)));
    this.set('menuItemPriceIds', Immutable.fromJS(object.menuItemPriceIds.map(_ => _)));
    this.addSortOrderIndexValueFromObject(object, 'menuItemPriceSortOrderIndices');
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'description');
    this.set('menuPageUrl', info.get('menuPageUrl'));
    this.set('imageUrl', info.get('imageUrl'));
    this.set('tagIds', info.get('tagIds'));
    this.set('menuItemPriceIds', info.get('menuItemPriceIds'));
    this.addSortOrderIndexValueFromImmutableInfo(info, 'menuItemPriceSortOrderIndices');
  };

  getInfo = () =>
    this.object
      .update('name', this.reduceMultiLanguagesStringList)
      .update('description', this.reduceMultiLanguagesStringList)
      .update('menuItemPriceSortOrderIndices', this.reduceSortOrderIndexList);
}
