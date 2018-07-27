// @flow

import ActionTypes from './ActionTypes';
import initialState from './InitialState';

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.DAILY_REPORT_FROM_DATETIME_CHANGED:
    return state.set('from', action.payload.datetime);

  case ActionTypes.DAILY_REPORT_TO_DATETIME_CHANGED:
    return state.set('to', action.payload.datetime);

  case ActionTypes.DAILY_REPORT_DATETIME_RANGE_CHANGED:
    return state.set('from', action.payload.from).set('to', action.payload.to);

  default:
    return state;
  }
};
