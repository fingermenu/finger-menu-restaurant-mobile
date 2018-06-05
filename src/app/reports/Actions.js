// @flow

import ActionTypes from './ActionTypes';

export function fromDateChanged(date) {
  return {
    type: ActionTypes.DAILY_REPORT_FROM_DATE_CHANGED,
    payload: {
      date,
    },
  };
}

export function toDateChanged(date) {
  return {
    type: ActionTypes.DAILY_REPORT_TO_DATE_CHANGED,
    payload: {
      date,
    },
  };
}
