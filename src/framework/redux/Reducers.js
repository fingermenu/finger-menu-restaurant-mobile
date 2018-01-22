// @flow

import { AppUpdaterReducer, NotificationReducer, UserAccessReducer } from '@microbusiness/common-react';
import { NetInfoReducer } from '@microbusiness/common-react-native';
import { combineReducers } from 'redux';
import { OrdersReducer } from '../../app/orders';
import { reducer as formReducer } from 'redux-form';

export default function getReducers(navigationReducer) {
  return combineReducers({
    userAccess: UserAccessReducer,
    navigation: navigationReducer,
    netInfo: NetInfoReducer,
    appUpdater: AppUpdaterReducer,
    notification: NotificationReducer,
    form: formReducer,
    orders: OrdersReducer,
  });
}
