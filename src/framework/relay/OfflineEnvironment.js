// @flow

import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { graphql } from 'graphql';
import AsyncStorage from 'react-native/Libraries/Storage/AsyncStorage';
import {
  getRootSchema,
  configLoaderByKey,
  choiceItemLoaderById,
  choiceItemPriceLoaderById,
  dietaryOptionLoaderById,
  dishTypeLoaderById,
  languageLoaderByKey,
  languageLoaderById,
  menuLoaderById,
  menuItemLoaderById,
  menuItemPriceLoaderById,
  restaurantLoaderById,
  servingTimeLoaderById,
  sizeLoaderById,
  tableLoaderById,
  tableStateLoaderByKey,
  tableStateLoaderById,
  tagLoaderById,
} from '../graphql';
import i18n from '../../i18n';
import packageInfo from '../../../package.json';

const rootSchema = getRootSchema();
let restaurantId;

AsyncStorage.getItem('restaurantId')
  .then(id => {
    restaurantId = id;
  })
  .catch(() => {});

const fetchOfflineQuery = async (operation, variables) => {
  if (!restaurantId) {
    restaurantId = await AsyncStorage.getItem('restaurantId');
  }

  const fingerMenuContext = JSON.stringify({ restaurantId, appVersion: packageInfo.version });
  const result = await graphql(
    rootSchema,
    operation.text,
    undefined,
    {
      language: i18n.language,
      fingerMenuContext,
      dataLoaders: {
        configLoaderByKey,
        choiceItemLoaderById,
        choiceItemPriceLoaderById,
        dietaryOptionLoaderById,
        dishTypeLoaderById,
        languageLoaderByKey,
        languageLoaderById,
        menuLoaderById,
        menuItemLoaderById,
        menuItemPriceLoaderById,
        restaurantLoaderById,
        servingTimeLoaderById,
        sizeLoaderById,
        tableLoaderById,
        tableStateLoaderByKey,
        tableStateLoaderById,
        tagLoaderById,
      },
    },
    variables,
  );

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map(error => error.message).reduce((reduction, message) => `${reduction}\n${message}`));
  }

  return result;
};

// Create a network layer from the fetch function
const network = Network.create(fetchOfflineQuery);
const store = new Store(new RecordSource());
const relayEnvironemnt = new Environment({
  network,
  store,
});

export default relayEnvironemnt;
