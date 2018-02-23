// @flow

/* eslint-disable import/prefer-default-export */

import ActionTypes from './ActionTypes';

export function selectedLanguageChanged(selectedLanguage) {
  return {
    type: ActionTypes.LOCAL_STATE_SELECTED_LANGUAGE_CHANGED,
    selectedLanguage,
  };
}
