// @flow

import { AppUpdaterReducer, AsyncStorageReducer, NotificationReducer, UserAccessReducer } from '@microbusiness/common-react';
import { NetInfoReducer } from '@microbusiness/common-react-native';
import { EscPosPrinterReducer } from '@microbusiness/printer-react-native';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { ApplicationStateReducer } from '../../framework/applicationState';

export default function getReducers(navigationReducer) {
  return combineReducers({
    applicationState: ApplicationStateReducer,
    userAccess: UserAccessReducer,
    navigation: navigationReducer,
    netInfo: NetInfoReducer,
    appUpdater: AppUpdaterReducer,
    asyncStorage: AsyncStorageReducer,
    escPosPrinter: EscPosPrinterReducer,
    notification: NotificationReducer,
    form: formReducer,
  });
}
