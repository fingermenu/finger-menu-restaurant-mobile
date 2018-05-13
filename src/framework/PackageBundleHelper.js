// @flow

import Immutable, { Map } from 'immutable';
import BluebirdPromise from 'bluebird';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import { unzip } from 'react-native-zip-archive';
import {
  realm,
  ChoiceItemService,
  ChoiceItemPriceService,
  DietaryOptionService,
  DishTypeService,
  LanguageService,
  MenuService,
  MenuItemService,
  MenuItemPriceService,
  RestaurantService,
  ServingTimeService,
  SizeService,
  TableService,
  TableStateService,
  TagService,
} from './realmDB';

export default class PackageBundleHelper {
  static cleanAllData = async () => {
    await PackageBundleHelper.cleanAllItems(new ChoiceItemService(realm));
    await PackageBundleHelper.cleanAllItems(new ChoiceItemPriceService(realm));
    await PackageBundleHelper.cleanAllItems(new DietaryOptionService(realm));
    await PackageBundleHelper.cleanAllItems(new DishTypeService(realm));
    await PackageBundleHelper.cleanAllItems(new LanguageService(realm));
    await PackageBundleHelper.cleanAllItems(new MenuService(realm));
    await PackageBundleHelper.cleanAllItems(new MenuItemService(realm));
    await PackageBundleHelper.cleanAllItems(new MenuItemPriceService(realm));
    await PackageBundleHelper.cleanAllItems(new RestaurantService(realm));
    await PackageBundleHelper.cleanAllItems(new ServingTimeService(realm));
    await PackageBundleHelper.cleanAllItems(new SizeService(realm));
    await PackageBundleHelper.cleanAllItems(new TableService(realm));
    await PackageBundleHelper.cleanAllItems(new TableStateService(realm));
    await PackageBundleHelper.cleanAllItems(new TagService(realm));
  };

  static cleanAllItems = async service => {
    await service.bulkDelete(Map({ conditions: Map({}) }));
  };

  constructor(oldPackageBundleChecksum, newPackageBundle) {
    this.oldPackageBundleChecksum = oldPackageBundleChecksum;
    this.newPackageBundle = newPackageBundle;
  }

  installPackageBundle = async () => {
    const jsonFilePath = RNFS.TemporaryDirectoryPath + '/finger-menu-package-bundle';
    let jsonFileExtracted = false;
    let zipFile;

    try {
      const exists = await RNFS.exists(jsonFilePath + '/data.json');

      if (exists) {
        await RNFS.unlink(jsonFilePath);
      }

      zipFile = await RNFetchBlob.config({ fileCache: true }).fetch('GET', this.newPackageBundle.url);

      const extractedDirectory = await unzip(zipFile.path(), jsonFilePath);

      jsonFileExtracted = true;

      await this.extractInfoToLocalDatabase(JSON.parse(await RNFS.readFile(extractedDirectory + '/data.json')));

      if (this.oldPackageBundleChecksum) {
        await this.cleanOldData();
      }
    } finally {
      if (zipFile) {
        await RNFS.unlink(zipFile.path());
      }

      if (jsonFileExtracted) {
        await RNFS.unlink(jsonFilePath);
      }
    }
  };

  extractInfoToLocalDatabase = async packageBundleContent => {
    await this.extractItemsToLocalDatabase(packageBundleContent.choiceItems, new ChoiceItemService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.choiceItemPrices, new ChoiceItemPriceService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.dietaryOptions, new DietaryOptionService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.dishTypes, new DishTypeService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.languages, new LanguageService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.menus, new MenuService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.menuItems, new MenuItemService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.menuItemPrices, new MenuItemPriceService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.restaurants, new RestaurantService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.servingTimes, new ServingTimeService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.sizes, new SizeService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.tables, new TableService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.tableStates, new TableStateService(realm));
    await this.extractItemsToLocalDatabase(packageBundleContent.tags, new TagService(realm));
  };

  cleanOldData = async () => {
    await this.cleanOldItems(new ChoiceItemService(realm));
    await this.cleanOldItems(new ChoiceItemPriceService(realm));
    await this.cleanOldItems(new DietaryOptionService(realm));
    await this.cleanOldItems(new DishTypeService(realm));
    await this.cleanOldItems(new LanguageService(realm));
    await this.cleanOldItems(new MenuService(realm));
    await this.cleanOldItems(new MenuItemService(realm));
    await this.cleanOldItems(new MenuItemPriceService(realm));
    await this.cleanOldItems(new RestaurantService(realm));
    await this.cleanOldItems(new ServingTimeService(realm));
    await this.cleanOldItems(new SizeService(realm));
    await this.cleanOldItems(new TableService(realm));
    await this.cleanOldItems(new TableStateService(realm));
    await this.cleanOldItems(new TagService(realm));
  };

  extractItemsToLocalDatabase = async (items, service) => {
    if (items.length === 0) {
      return;
    }

    await BluebirdPromise.each(items, item => service.create(Immutable.fromJS(item).set('packageBundleChecksum', this.newPackageBundle.checksum)));
  };

  cleanOldItems = async service => {
    await service.bulkDelete(Map({ conditions: Map({ packageBundleChecksum: this.oldPackageBundleChecksum }) }));
  };
}
