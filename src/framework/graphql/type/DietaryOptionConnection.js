// @flow

import { ImmutableEx, RelayHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, DietaryOptionService } from '../../realmDB';
import DietaryOption from './DietaryOption';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('dietaryOptionIds') ? searchArgs.get('dietaryOptionIds') : undefined,
      conditions: Map({}),
    }),
  );

const addSortOptionToCriteria = criteria => {
  return criteria;
};

const getDietaryOptionsCountMatchCriteria = async searchArgs =>
  new DietaryOptionService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getDietaryOptionsMatchCriteria = async (searchArgs, limit, skip) =>
  new DietaryOptionService(realm).search(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })));

export const getDietaryOptions = async searchArgs => {
  const count = await getDietaryOptionsCountMatchCriteria(searchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getDietaryOptionsMatchCriteria(searchArgs, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'DietaryOptionType',
  nodeType: DietaryOption,
});
