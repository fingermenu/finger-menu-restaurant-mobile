// @flow

import Immutable, { Map } from 'immutable';
import BaseObject from './BaseObject';

const schema = Map({
  name: 'Restaurant',
  properties: Map({
    name: 'MultiLanguagesString[]',
    websiteUrl: 'string',
    pin: 'string',
    menuIds: 'string[]',
    menuSortOrderIndices: 'SortOrderIndex[]',
  }).merge(BaseObject.getBaseSchema()),
}).toJS();

export default class Restaurant extends BaseObject {
  static getSchema = () => schema;

  static spawn = info => {
    const object = new Restaurant();

    object.updateInfo(info);

    return object;
  };

  constructor(object) {
    super(object);

    if (!object) {
      return;
    }

    this.addMultiLanguagesStringValueFromObject(object, 'name');
    this.set('websiteUrl', object.websiteUrl);
    this.set('pin', object.pin);
    this.set('menuIds', Immutable.fromJS(object.toBeServedWithMenuItemPriceIds.map(_ => _)));
    this.addSortOrderIndexValueFromObject(object, 'menuSortOrderIndices');
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.set('websiteUrl', info.get('websiteUrl'));
    this.set('pin', info.get('pin'));
    this.set('menuIds', info.get('menuIds'));
    this.addSortOrderIndexValueFromImmutableInfo(info, 'menuSortOrderIndices');
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList).update('menuSortOrderIndices', this.reduceSortOrderIndexList);
}
