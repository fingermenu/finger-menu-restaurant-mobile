// @flow

import { AppUpdaterReducer, MessageBarReducer, UserAccessReducer } from '@microbusiness/common-react';
import { NetInfoReducer } from '@microbusiness/common-react-native';
import { combineReducers } from 'redux';
import { OrdersReducer } from '../../app/orders';

export default function getReducers(navigationReducer) {
  return combineReducers({
    userAccess: UserAccessReducer,
    navigation: navigationReducer,
    netInfo: NetInfoReducer,
    appUpdater: AppUpdaterReducer,
    messageBar: MessageBarReducer,
    orders: OrdersReducer,
  });
}
