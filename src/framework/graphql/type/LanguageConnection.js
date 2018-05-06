// @flow

import { ImmutableEx, RelayHelper, StringHelper } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { connectionDefinitions } from 'graphql-relay';
import { LanguageService } from '../../realmDB';
import Language from './Language';
import Common from './Common';

const getCriteria = searchArgs =>
  ImmutableEx.removeUndefinedProps(
    Map({
      ids: searchArgs.has('languageIds') ? searchArgs.get('languageIds') : undefined,
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

const addSortOptionToCriteria = (criteria, sortOption) => {
  if (sortOption && sortOption.localeCompare('NameDescending') === 0) {
    return criteria.set('orderByFieldDescending', 'name');
  }

  if (sortOption && sortOption.localeCompare('NameAscending') === 0) {
    return criteria.set('orderByFieldAscending', 'name');
  }

  return criteria.set('orderByFieldAscending', 'name');
};

const getLanguagesCountMatchCriteria = async searchArgs =>
  new LanguageService().count(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')));

const getLanguagesMatchCriteria = async (searchArgs, limit, skip) =>
  new LanguageService().search(addSortOptionToCriteria(getCriteria(searchArgs), searchArgs.get('sortOption')).merge(Map({ limit, skip })));

export const getLanguages = async searchArgs => {
  const count = await getLanguagesCountMatchCriteria(searchArgs);

  if (count === 0) {
    return Common.getEmptyResult();
  }

  const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, count, 10, 1000);
  const results = await getLanguagesMatchCriteria(searchArgs, limit, skip);

  return Common.convertResultsToRelayConnectionResponse(results, skip, limit, count, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
  name: 'LanguageType',
  nodeType: Language,
});
