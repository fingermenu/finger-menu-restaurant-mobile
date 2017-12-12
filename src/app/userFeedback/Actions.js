// @flow

import ActionTypes from './ActionTypes';

export function userFeedbackMessageChanged(payload) {
  return {
    type: ActionTypes.USER_FEEDBACK_MESSAGE_CHANGED,
    payload,
  };
}

export function userFeedbackOptionsChanged(payload) {
  return {
    type: ActionTypes.USER_FEEDBACK_OPTIONS_CHANGED,
    payload,
  };
}
