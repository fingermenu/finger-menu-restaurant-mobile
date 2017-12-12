// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USER_FEEDBACK_MESSAGE_CHANGED: {
      return state.set('message', action.payload.get('message'));
    }
    case ActionTypes.USER_FEEDBACK_OPTIONS_CHANGED: {
      return state.set('options', action.payload.get('options'));
    }

    default:
      return state;
  }
};
