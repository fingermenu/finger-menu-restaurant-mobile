// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionHeader: {
    padding: 5,
    backgroundColor: DefaultColor.defaultFontColorDisabled,
  },
  optionRowContainer: {
    flexDirection: 'row',
  },
  checkboxContainer: {
    flex: 30,
  },
  optionContainer: {
    flex: 100,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 13,
  },
  price: {
    fontSize: 14,
  },
});
