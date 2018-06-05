// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.DAILY_REPORT_FROM_DATE_CHANGED:
    return state.set('from', action.payload.date);

  case ActionTypes.DAILY_REPORT_TO_DATE_CHANGED:
    return state.set('to', action.payload.date);

  default:
    return state;
  }
};
