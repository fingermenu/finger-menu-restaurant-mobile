// @flow

import { UserService } from '@microbusiness/parse-server-common-react-native';
import Immutable from 'immutable';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import Config from 'react-native-config';
import i18n from '../../i18n/';

const fetchQuery = async (operation, variables) => {
  const sessionToken = await UserService.getCurrentUserSession();
  const response = await fetch(Config.GRAPHQL_ENDPOINT, {
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
  console.log(JSON.stringify(result));
  if (result.errors && result.errors.length > 0) {
    const errorMessage = Immutable.fromJS(result.errors)
      .map(error => error.get('message'))
      .reduce((reduction, value) => `${reduction}\n${value}`);

    throw new Error(errorMessage);
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
