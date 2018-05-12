// @flow

import { ImmutableEx, RelayHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, ServingTimeService } from '../../realmDB';
import ServingTime from './ServingTime';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('servingTimeIds') ? searchArgs.get('servingTimeIds') : undefined,
      conditions: Map({}),
    }),
  );

const addSortOptionToCriteria = criteria => {
  return criteria;
};

const getServingTimesCountMatchCriteria = async searchArgs =>
  new ServingTimeService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getServingTimesMatchCriteria = async (searchArgs, limit, skip) =>
  new ServingTimeService(realm).search(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })));

export const getServingTimes = async searchArgs => {
  const count = await getServingTimesCountMatchCriteria(searchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getServingTimesMatchCriteria(searchArgs, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'ServingTimeType',
  nodeType: ServingTime,
});
