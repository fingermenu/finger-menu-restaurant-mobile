// @flow

import Immutable, { Map } from 'immutable';
import BluebirdPromise from 'bluebird';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import { unzip } from 'react-native-zip-archive';
import { realm, LanguageService } from './realmDB';

export default class PackageBundleHelper {
  constructor(oldPackageBundle, newPackageBundle) {
    this.oldPackageBundle = oldPackageBundle;
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
      await this.cleanOldData();
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
    await this.extractLanguagesToLocalDatabase(packageBundleContent.languages);
  };

  extractLanguagesToLocalDatabase = async items => {
    await this.extractItemsToLocalDatabase(items, new LanguageService(realm));
  };

  extractItemsToLocalDatabase = async (items, service) => {
    if (items.length === 0) {
      return;
    }

    await BluebirdPromise.each(items, item => service.create(Immutable.fromJS(item).set('packageBundleChecksum', this.newPackageBundle.checksum)));
  };

  cleanOldData = async () => {
    await this.cleanOldLanguages();
  };

  cleanOldLanguages = async () => {
    await this.cleanOldItems(new LanguageService(realm));
  };

  cleanOldItems = async service => {
    const items = await service.search(Map({ conditions: Map({ packageBundleChecksum: this.oldPackageBundle.checksum }) }));

    await BluebirdPromise.each(items.toArray(), item => service.delete(item.get('realmId')));
  };
}
