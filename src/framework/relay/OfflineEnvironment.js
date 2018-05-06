// @flow

import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { graphql } from 'graphql';
import { getRootSchema } from '../graphql';
import i18n from '../../i18n';

const rootSchema = getRootSchema();

const fetchOfflineQuery = async (operation, variables) => {
  const result = await graphql(rootSchema, operation.text, undefined, { language: i18n.language }, variables);

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map(error => error.message).reduce((reduction, message) => `${reduction}\n${message}`));
  }

  return result;
};

// Create a network layer from the fetch function
const network = Network.create(fetchOfflineQuery);
const store = new Store(new RecordSource());
const environment = new Environment({
  network,
  store,
});

export default environment;
