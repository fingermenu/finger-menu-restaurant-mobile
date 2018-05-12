// @flow

import Immutable, { List, Map } from 'immutable';
import BaseObject from './BaseObject';
import RestaurantImages from './RestaurantImages';
import Printer from './Printer';
import DocumentTemplate from './DocumentTemplate';

const schema = Map({
  name: 'Restaurant',
  properties: Map({
    name: 'MultiLanguagesString[]',
    websiteUrl: 'string',
    pin: 'string',
    menuIds: 'string[]',
    menuSortOrderIndices: 'SortOrderIndex[]',
    address: 'string?',
    googleMapUrl: 'string?',
    inheritParentRestaurantMenus: 'bool?',
    parentRestaurantId: 'string?',
    configurations: 'RestaurantConfigurations',
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
    this.set('address', object.address);
    this.set('googleMapUrl', object.googleMapUrl);
    this.set('inheritParentRestaurantMenus', object.inheritParentRestaurantMenus);
    this.set('parentRestaurantId', object.parentRestaurantId);

    const configurations = object.configurations;

    if (configurations) {
      const images = configurations.images ? new RestaurantImages(configurations.images).getInfo() : Map();
      const printers = configurations.printers ? Immutable.fromJS(configurations.printers.map(_ => new Printer(_).getInfo())) : List();
      const documentTemplates = configurations.documentTemplates
        ? Immutable.fromJS(configurations.documentTemplates.map(_ => new DocumentTemplate(_).getInfo()))
        : List();

      this.set(
        'configurations',
        Map({
          images,
          printers,
          documentTemplates,
          numberOfPrintCopiesForKitchen: configurations.numberOfPrintCopiesForKitchen,
          gstPercentage: configurations.gstPercentage,
        }),
      );
    }
  }

  updateInfo = info => {
    this.updateInfoBase(info);

    this.addMultiLanguagesStringValueFromImmutableInfo(info, 'name');
    this.set('websiteUrl', info.get('websiteUrl'));
    this.set('pin', info.get('pin'));
    this.set('menuIds', info.get('menuIds'));
    this.addSortOrderIndexValueFromImmutableInfo(info, 'menuSortOrderIndices');
    this.set('address', info.get('address'));
    this.set('googleMapUrl', info.get('googleMapUrl'));
    this.set('inheritParentRestaurantMenus', info.get('inheritParentRestaurantMenus'));
    this.set('parentRestaurantId', info.get('parentRestaurantId'));
    this.set('configurations', info.get('configurations'));
  };

  getInfo = () => this.object.update('name', this.reduceMultiLanguagesStringList).update('menuSortOrderIndices', this.reduceSortOrderIndexList);
}
