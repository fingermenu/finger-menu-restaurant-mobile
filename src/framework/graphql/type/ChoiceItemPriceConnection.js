// @flow

import { ImmutableEx, RelayHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, ChoiceItemPriceService } from '../../realmDB';
import ChoiceItemPrice from './ChoiceItemPrice';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('choiceItemPriceIds') ? searchArgs.get('choiceItemPriceIds') : undefined,
      conditions: Map({}),
    }),
  );

const addSortOptionToCriteria = (criteria, sortOption) => {
  if (sortOption && sortOption.localeCompare('CurrentPriceDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'currentPrice');
  }

  if (sortOption && sortOption.localeCompare('CurrentPriceAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'currentPrice');
  }

  if (sortOption && sortOption.localeCompare('WasPriceDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'wasPrice');
  }

  if (sortOption && sortOption.localeCompare('WasPriceAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'wasPrice');
  }

  if (sortOption && sortOption.localeCompare('ValidFromDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'validFrom');
  }

  if (sortOption && sortOption.localeCompare('ValidFromAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'validFrom');
  }

  if (sortOption && sortOption.localeCompare('ValidUntilDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'validUntil');
  }

  if (sortOption && sortOption.localeCompare('ValidUntilAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'validUntil');
  }

  return criteria.set('orderByFieldAscending', 'currentPrice');
};

const getChoiceItemPricesCountMatchCriteria = async searchArgs =>
  new ChoiceItemPriceService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getChoiceItemPricesMatchCriteria = async (searchArgs, limit, skip) =>
  new ChoiceItemPriceService(realm).search(
    addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })),
  );

export const getChoiceItemPrices = async (searchArgs, { menuItemPriceLoaderById }) => {
  let finalSearchArgs = searchArgs;
  const menuItemPriceId = finalSearchArgs.get('menuItemPriceId');
  let menuItemPrice;

  if (menuItemPriceId) {
    menuItemPrice = await menuItemPriceLoaderById.load(menuItemPriceId);

    const choiceItemPriceIds = menuItemPrice.get('choiceItemPriceIds');

    if (!choiceItemPriceIds || choiceItemPriceIds.isEmpty()) {
      return Common.getEmptyResult();
    }

    finalSearchArgs = finalSearchArgs.set('choiceItemPriceIds', choiceItemPriceIds);
  }

  const count = await getChoiceItemPricesCountMatchCriteria(finalSearchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(finalSearchArgs, count, 10, 1000);
  let results = await getChoiceItemPricesMatchCriteria(finalSearchArgs, limit, skip);

  if (menuItemPrice) {
    const choiceItemPriceSortOrderIndices = menuItemPrice.get('choiceItemPriceSortOrderIndices');

    if (choiceItemPriceSortOrderIndices) {
      results = results.map(_ => _.set('sortOrderIndex', choiceItemPriceSortOrderIndices.get(_.get('id'))));
    }
  }

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'ChoiceItemPriceType',
  nodeType: ChoiceItemPrice,
});
