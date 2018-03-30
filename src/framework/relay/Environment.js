// @flow

import { ConfigReader } from '@microbusiness/common-react-native';
import { UserService } from '@microbusiness/parse-server-common-react-native';
import AsyncStorage from 'react-native/Libraries/Storage/AsyncStorage';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import i18n from '../../i18n';

const fetchQuery = async (operation, variables) => {
  const environment = await AsyncStorage.getItem('@global:environment');
  const configReader = new ConfigReader(environment ? environment : ConfigReader.getDefaultEnvironment());
  const sessionToken = await UserService.getCurrentUserSession();
  const response = await fetch(configReader.getGraphQLEndpointUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: sessionToken,
      'Accept-Language': i18n.language,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.reduce((reduction, error) => `${reduction}\n${error.message}`));
  }

  return result;
};

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);
const store = new Store(new RecordSource());
const environment = new Environment({
  network,
  store,
});

export default environment;
