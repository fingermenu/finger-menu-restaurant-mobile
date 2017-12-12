// @flow

import { combineReducers } from 'redux';
import { UserAccessReducer } from 'micro-business-parse-server-common-react-native';
import { AppUpdaterReducer, MessageBarReducer } from 'micro-business-common-react';
import { NetInfoReducer } from 'micro-business-common-react-native';
import { ShoppingListDetailReducer } from '../../app/shoppingList';
import { StapleItemsReducer } from '../../app/stapleItems';
import { ProductsFilterReducer } from '../../sharedComponents/productsFilter';
import { ProductReducer } from '../../app/products';
import { LocalStateReducer } from '../localState';
import { UserFeedbackReducer } from '../../app/userFeedback';

export default function getReducers(navigationReducer) {
  return combineReducers({
    userAccess: UserAccessReducer,
    navigation: navigationReducer,
    netInfo: NetInfoReducer,
    appUpdater: AppUpdaterReducer,
    messageBar: MessageBarReducer,
    stapleItems: StapleItemsReducer,
    productsFilter: ProductsFilterReducer,
    products: ProductReducer,
    shoppingListDetail: ShoppingListDetailReducer,
    localState: LocalStateReducer,
    userFeedback: UserFeedbackReducer,
  });
}
