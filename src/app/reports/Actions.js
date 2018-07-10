// @flow

import ActionTypes from './ActionTypes';

export function fromDateTimeChanged(datetime) {
  return {
    type: ActionTypes.DAILY_REPORT_FROM_DATETIME_CHANGED,
    payload: {
      datetime,
    },
  };
}

export function toDateTimeChanged(datetime) {
  return {
    type: ActionTypes.DAILY_REPORT_TO_DATETIME_CHANGED,
    payload: {
      datetime,
    },
  };
}

export function dateTimeRangeChanged(from, to) {
  return {
    type: ActionTypes.DAILY_REPORT_DATETIME_RANGE_CHANGED,
    payload: {
      from,
      to,
    },
  };
}
