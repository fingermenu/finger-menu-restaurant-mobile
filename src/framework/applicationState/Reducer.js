// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.APPLICATION_STATE_SELECTED_LANGUAGE_CHANGED:
    return state.set('selectedLanguage', action.selectedLanguage);

  default:
    return state;
  }
};
