// @flow

import { combineReducers } from 'redux';
import { AppUpdaterReducer, MessageBarReducer, UserAccessReducer } from 'micro-business-common-react';
import { NetInfoReducer } from 'micro-business-common-react-native';

export default function getReducers(navigationReducer) {
  return combineReducers({
    userAccess: UserAccessReducer,
    navigation: navigationReducer,
    netInfo: NetInfoReducer,
    appUpdater: AppUpdaterReducer,
    messageBar: MessageBarReducer,
  });
}
