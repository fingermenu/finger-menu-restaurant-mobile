// @flow

import {
  watchGetCurrentUser,
  watchSignUpWithUsernameAndPassword,
  watchSignInWithUsernameAndPassword,
  watchSignInWithFacebook,
  watchSignOut,
} from 'micro-business-parse-server-common-react-native';
import { watchRefreshState } from 'micro-business-common-react-native';
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
  ];
};

export default function configureStore(navigationReducer, initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = applyMiddleware(sagaMiddleware);
  const store = createStore(getReducers(navigationReducer), initialState, middleware);

  sagaMiddleware.run(rootSagas);

  return store;
}
