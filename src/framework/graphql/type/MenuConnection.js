// @flow

import { ImmutableEx, RelayHelper, StringHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, MenuService } from '../../realmDB';
import Menu from './Menu';
import Common from './Common';

const getCriteria = (searchArgs, language) =>
  ImmutableEx.removeUndefinedProps(
    Map({
      language,
      ids: searchArgs.has('menuIds') ? searchArgs.get('menuIds') : undefined,
      conditions: Map({
        contains_names: StringHelper.convertStringArgumentToSet(searchArgs.get('name')),
        contains_descriptions: StringHelper.convertStringArgumentToSet(searchArgs.get('description')),
      }),
    }),
  );

const addSortOptionToCriteria = (criteria, sortOption, language) => {
  if (sortOption && sortOption.localeCompare('NameDescending') === 0) {
    return criteria.set('orderByFieldDescending', `${language}_name`);
  }

  if (sortOption && sortOption.localeCompare('NameAscending') === 0) {
    return criteria.set('orderByFieldAscending', `${language}_name`);
  }

  if (sortOption && sortOption.localeCompare('DescriptionDescending') === 0) {
    return criteria.set('orderByFieldDescending', `${language}_description`);
  }

  if (sortOption && sortOption.localeCompare('DescriptionAscending') === 0) {
    return criteria.set('orderByFieldAscending', `${language}_description`);
  }

  return criteria.set('orderByFieldAscending', `${language}_name`);
};

const getMenusCountMatchCriteria = async (searchArgs, language) =>
  new MenuService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language));

const getMenusMatchCriteria = async (searchArgs, language, limit, skip) =>
  new MenuService(realm).search(
    addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language).merge(Map({ limit, skip })),
  );

export const getMenus = async (searchArgs, { restaurantLoaderById }, language) => {
  let finalSearchArgs = searchArgs;
  const restaurantId = finalSearchArgs.get('restaurantId');
  let restaurant;

  if (restaurantId) {
    restaurant = await restaurantLoaderById.load(restaurantId);

    const menuIds = restaurant.get('menuIds');

    if (!menuIds || menuIds.isEmpty()) {
      return Common.getEmptyResult();
    }

    finalSearchArgs = finalSearchArgs.set('menuIds', menuIds);
  }

  const count = await getMenusCountMatchCriteria(finalSearchArgs, language);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(finalSearchArgs, count, 10, 1000);
  let results = await getMenusMatchCriteria(finalSearchArgs, language, limit, skip);

  if (restaurant) {
    const menuSortOrderIndices = restaurant.get('menuSortOrderIndices');

    if (menuSortOrderIndices) {
      results = results.map(_ => _.set('sortOrderIndex', menuSortOrderIndices.get(_.get('id'))));
    }
  }

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'MenuType',
  nodeType: Menu,
});
