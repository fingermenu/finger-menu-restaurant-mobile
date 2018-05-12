// @flow

import { ImmutableEx, RelayHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, MenuItemPriceService } from '../../realmDB';
import MenuItemPrice from './MenuItemPrice';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('menuItemPriceIds') ? searchArgs.get('menuItemPriceIds') : undefined,
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

const getMenuItemPricesCountMatchCriteria = async searchArgs =>
  new MenuItemPriceService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getMenuItemPricesMatchCriteria = async (searchArgs, limit, skip) =>
  new MenuItemPriceService(realm).search(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })));

export const getMenuItemPrices = async (searchArgs, { menuLoaderById }) => {
  let finalSearchArgs = searchArgs;
  const menuId = finalSearchArgs.get('menuId');
  let menu;

  if (menuId) {
    menu = await menuLoaderById.load(menuId);

    const menuItemPriceIds = menu.get('menuItemPriceIds');

    if (!menuItemPriceIds || menuItemPriceIds.isEmpty()) {
      return Common.getEmptyResult();
    }

    finalSearchArgs = finalSearchArgs.set('menuItemPriceIds', menuItemPriceIds);
  }

  const count = await getMenuItemPricesCountMatchCriteria(finalSearchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(finalSearchArgs, count, 10, 1000);
  let results = await getMenuItemPricesMatchCriteria(finalSearchArgs, limit, skip);

  if (menu) {
    const menuItemPriceSortOrderIndices = menu.get('menuItemPriceSortOrderIndices');

    if (menuItemPriceSortOrderIndices) {
      results = results.map(_ => _.set('sortOrderIndex', menuItemPriceSortOrderIndices.get(_.get('id'))));
    }
  }

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'MenuItemPriceType',
  nodeType: MenuItemPrice,
});
