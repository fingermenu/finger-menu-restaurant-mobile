// @flow

import { List, Map } from 'immutable';
import { Maybe } from 'monet';

export default Map({
  defaultShoppingList: Map({ id: '', name: '', totalItemsCount: Maybe.None(), itemIds: List() }),
});
