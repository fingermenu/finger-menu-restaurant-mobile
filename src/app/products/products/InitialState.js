// @flow

import { List, Map } from 'immutable';

export default Map({
  isSearchingMode: false,
  searchKeyword: '',
  filterOptions: Map({
    sortOption: 'NameAscending',
    categories: List(),
    stores: List(),
  }),
});
