// @flow

import { StyleSheet } from 'react-native'; // eslint-disable-line import/no-extraneous-dependencies

const DEFAULT_THEME_COLOR = '#645953';

export const DefaultColors = {
  defaultThemeColor: DEFAULT_THEME_COLOR,
};

export default StyleSheet.create({
  radio: {
    margin: 0,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  radioContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  optionName: {
    fontSize: 26,
    paddingLeft: 10,
  },
});
