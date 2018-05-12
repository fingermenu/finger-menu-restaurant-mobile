// @flow

import { ImmutableEx, RelayHelper, StringHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, TableStateService } from '../../realmDB';
import TableState from './TableState';
import Common from './Common';

const getCriteria = (searchArgs, language) =>
  ImmutableEx.removeUndefinedProps(
    Map({
      language,
      ids: searchArgs.has('tableStateIds') ? searchArgs.get('tableStateIds') : undefined,
      conditions: Map({
        contains_names: StringHelper.convertStringArgumentToSet(searchArgs.get('name')),
        key: searchArgs.has('key')
          ? searchArgs
            .get('key')
            .trim()
            .toLowerCase()
          : undefined,
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

  return criteria.set('orderByFieldAscending', `${language}_name`);
};

const getTableStatesCountMatchCriteria = async (searchArgs, language) =>
  new TableStateService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language));

const getTableStatesMatchCriteria = async (searchArgs, language, limit, skip) =>
  new TableStateService(realm).search(
    addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language).merge(Map({ limit, skip })),
  );

export const getTableStates = async (searchArgs, language) => {
  const count = await getTableStatesCountMatchCriteria(searchArgs, language);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getTableStatesMatchCriteria(searchArgs, language, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'TableStateType',
  nodeType: TableState,
});
