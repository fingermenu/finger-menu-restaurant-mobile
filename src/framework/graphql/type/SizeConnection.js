// @flow

import { ImmutableEx, RelayHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, SizeService } from '../../realmDB';
import Size from './Size';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('sizeIds') ? searchArgs.get('sizeIds') : undefined,
      conditions: Map({}),
    }),
  );

const addSortOptionToCriteria = criteria => {
  return criteria;
};

const getSizesCountMatchCriteria = async searchArgs =>
  new SizeService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getSizesMatchCriteria = async (searchArgs, limit, skip) =>
  new SizeService(realm).search(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })));

export const getSizes = async searchArgs => {
  const count = await getSizesCountMatchCriteria(searchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getSizesMatchCriteria(searchArgs, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'SizeType',
  nodeType: Size,
});
