// @flow

import {
  watchGetCurrentUser,
  watchSignUpWithUsernameAndPassword,
  watchSignInWithUsernameAndPassword,
  watchSignInWithFacebook,
  watchSignOut,
} from '@microbusiness/parse-server-common-react-native';
import { watchRefreshState, watchReadValue, watchWriteValue } from '@microbusiness/common-react-native';
import { watchEscPosPrinterPrintDocument } from '@microbusiness/printer-react-native';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import getReducers from './Reducers';

const rootSagas = function* sagas() {
  yield [
    watchGetCurrentUser(),
    watchSignUpWithUsernameAndPassword(),
    watchSignInWithUsernameAndPassword(),
    watchSignInWithFacebook(),
    watchSignOut(),
    watchRefreshState(),
    watchWriteValue(),
    watchReadValue(),
    watchEscPosPrinterPrintDocument(),
  ];
};

export default function configureStore(navigationReducer, initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = applyMiddleware(sagaMiddleware);
  const store = createStore(getReducers(navigationReducer), initialState, middleware);

  sagaMiddleware.run(rootSagas);

  return store;
}
