// @flow

import { ImmutableEx, RelayHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, DishTypeService } from '../../realmDB';
import DishType from './DishType';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('dishTypeIds') ? searchArgs.get('dishTypeIds') : undefined,
      conditions: Map({}),
    }),
  );

const addSortOptionToCriteria = criteria => {
  return criteria;
};

const getDishTypesCountMatchCriteria = async searchArgs =>
  new DishTypeService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getDishTypesMatchCriteria = async (searchArgs, limit, skip) =>
  new DishTypeService(realm).search(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })));

export const getDishTypes = async searchArgs => {
  const count = await getDishTypesCountMatchCriteria(searchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getDishTypesMatchCriteria(searchArgs, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'DishTypeType',
  nodeType: DishType,
});
