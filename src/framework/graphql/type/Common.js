// @flow

import { Range } from 'immutable';

export default class Common {
  static getEmptyResult = () => ({
    edges: [],
    count: 0,
    pageInfo: {
      startCursor: 'cursor not available',
      endCursor: 'cursor not available',
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });

  static convertResultsToRelayConnectionResponse = (results, skip, limit, count, hasNextPage, hasPreviousPage) => {
    const indexedResults = results.zip(Range(skip, skip + limit));
    const edges = indexedResults.map(indexedResult => ({
      node: indexedResult[0],
      cursor: indexedResult[1] + 1,
    }));

    const firstEdge = edges.first();
    const lastEdge = edges.last();

    return {
      edges: edges.toArray(),
      count,
      pageInfo: {
        startCursor: firstEdge ? firstEdge.cursor : 'cursor not available',
        endCursor: lastEdge ? lastEdge.cursor : 'cursor not available',
        hasPreviousPage,
        hasNextPage,
      },
    };
  };

  static getTranslationToDisplay = async (info, columnName, language, { restaurantLoaderById, configLoaderByKey }, { restaurantId }) => {
    const allValues = info.get(columnName);

    if (!allValues) {
      return null;
    }

    if (allValues.has(language)) {
      return allValues.get(language);
    }

    if (restaurantId) {
      const defaultDisplay = (await restaurantLoaderById.load(restaurantId)).getIn(['configurations', 'languages', 'defaultDisplay']);

      if (defaultDisplay && allValues.has(defaultDisplay)) {
        return allValues.get(defaultDisplay);
      }
    }

    return allValues.get(await configLoaderByKey.load('fallbackLanguage'));
  };

  static getTranslationToPrintOnKitchenReceipt = async (info, columnName, dataLoaders, fingerMenuContext) =>
    Common.getTranslationToPrint(info, columnName, dataLoaders, fingerMenuContext, 'printOnKitchenReceipt');

  static getTranslationToPrintOnCustomerReceipt = async (info, columnName, dataLoaders, fingerMenuContext) =>
    Common.getTranslationToPrint(info, columnName, dataLoaders, fingerMenuContext, 'printOnCustomerReceipt');

  static getTranslationToPrint = async (info, columnName, { restaurantLoaderById, configLoaderByKey }, { restaurantId }, languageKey) => {
    const allValues = info.get(columnName);

    if (!allValues) {
      return null;
    }

    if (restaurantId) {
      const languageToPrint = (await restaurantLoaderById.load(restaurantId)).getIn(['configurations', 'languages', languageKey]);

      if (languageToPrint && allValues.has(languageToPrint)) {
        return allValues.get(languageToPrint);
      }
    }

    return allValues.get(await configLoaderByKey.load('fallbackLanguage'));
  };
}
