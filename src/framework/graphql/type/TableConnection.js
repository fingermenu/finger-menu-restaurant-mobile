// @flow

import { ImmutableEx, RelayHelper, StringHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { realm, TableService } from '../../realmDB';
import Table from './Table';
import Common from './Common';

const getCriteria = (searchArgs, language) =>
  ImmutableEx.removeUndefinedProps(
    Map({
      language,
      ids: searchArgs.has('tableIds') ? searchArgs.get('tableIds') : undefined,
      conditions: Map({
        contains_names: StringHelper.convertStringArgumentToSet(searchArgs.get('name')),
        restaurantId: searchArgs.has('restaurantId') ? searchArgs.get('restaurantId') : undefined,
      }),
    }),
  );

const addSortOptionToCriteria = (criteria, sortOption, language) => {
  if (sortOption && sortOption.localeCompare('SortOrderIndexDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'sortOrderIndex');
  }

  if (sortOption && sortOption.localeCompare('SortOrderIndexAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'sortOrderIndex');
  }

  if (sortOption && sortOption.localeCompare('NameDescending') === 0) {
    return criteria.set('orderByFieldDescending', `${language}_name`);
  }

  if (sortOption && sortOption.localeCompare('NameAscending') === 0) {
    return criteria.set('orderByFieldAscending', `${language}_name`);
  }

  return criteria.set('orderByFieldAscending', 'sortOrderIndex');
};

const getTablesCountMatchCriteria = async (searchArgs, language) =>
  new TableService(realm).count(addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language));

const getTablesMatchCriteria = async (searchArgs, language, limit, skip) =>
  new TableService(realm).search(
    addSortOptionToCriteria(getCriteria(searchArgs, language), searchArgs.get('sortOption'), language).merge(Map({ limit, skip })),
  );

export const getTables = async (searchArgs, language) => {
  const count = await getTablesCountMatchCriteria(searchArgs, language);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getTablesMatchCriteria(searchArgs, language, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'TableType',
  nodeType: Table,
});
