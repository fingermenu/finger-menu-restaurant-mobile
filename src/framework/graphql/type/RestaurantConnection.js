// @flow

import { ImmutableEx, RelayHelper, StringHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, RestaurantService } from '../../realmDB';
import Restaurant from './Restaurant';
import Common from './Common';

const getCriteria = (searchArgs, language) =>
  ImmutableEx.removeUndefinedProps(
    Map({
      language,
      ids: searchArgs.has('restaurantIds') ? searchArgs.get('restaurantIds') : undefined,
      conditions: Map({
        contains_names: StringHelper.convertStringArgumentToSet(searchArgs.get('name')),
        status: searchArgs.has('status') ? searchArgs.get('status') : undefined,
        inheritParentRestaurantMenus: searchArgs.has('inheritParentRestaurantMenus') ? searchArgs.get('inheritParentRestaurantMenus') : undefined,
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

  if (sortOption && sortOption.localeCompare('AddressDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'address');
  }

  if (sortOption && sortOption.localeCompare('AddressAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'address');
  }

  if (sortOption && sortOption.localeCompare('InheritParentRestaurantMenusDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'inheritParentRestaurantMenus');
  }

  if (sortOption && sortOption.localeCompare('InheritParentRestaurantMenusAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'inheritParentRestaurantMenus');
  }

  return criteria.set('orderByFieldAscending', `${language}_name`);
};

const getRestaurantsCountMatchCriteria = async (searchArgs, language) =>
  new RestaurantService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language));

const getRestaurantsMatchCriteria = async (searchArgs, language, limit, skip) =>
  new RestaurantService(realm).search(
    addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language).merge(Map({ limit, skip })),
  );

export const getRestaurants = async (searchArgs, language) => {
  const count = await getRestaurantsCountMatchCriteria(searchArgs, language);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getRestaurantsMatchCriteria(searchArgs, language, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'RestaurantType',
  nodeType: Restaurant,
});
