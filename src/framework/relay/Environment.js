// @flow

import { ConfigReader } from '@microbusiness/common-react-native';
import { UserService } from '@microbusiness/parse-server-common-react-native';
import AsyncStorage from 'react-native/Libraries/Storage/AsyncStorage';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import i18n from '../../i18n';
import packageInfo from '../../../package.json';

let environment;
let restaurantId;

AsyncStorage.getItem('@global:environment')
  .then(id => {
    restaurantId = id;
  })
  .catch(() => {});

AsyncStorage.getItem('restaurantId')
  .then(id => {
    restaurantId = id;
  })
  .catch(() => {});

const fetchQuery = async (operation, variables) => {
  if (!environment) {
    environment = await AsyncStorage.getItem('@global:environment');
  }

  if (!restaurantId) {
    restaurantId = await AsyncStorage.getItem('restaurantId');
  }

  const fingerMenuContext = JSON.stringify({ restaurantId, appVersion: packageInfo.version });
  const configReader = new ConfigReader(environment ? environment : ConfigReader.getDefaultEnvironment());
  const sessionToken = await UserService.getCurrentUserSession();
  const response = await fetch(configReader.getGraphQLEndpointUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: sessionToken,
      'Accept-Language': i18n.language,
      'finger-menu-context': fingerMenuContext,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map(error => error.message).reduce((reduction, message) => `${reduction}\n${message}`));
  }

  return result;
};

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);
const store = new Store(new RecordSource());
const relayEnvironment = new Environment({
  network,
  store,
});

export default relayEnvironment;
