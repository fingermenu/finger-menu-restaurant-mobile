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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  checkboxContainer: {
    flex: 10,
  },
  optionContainer: {
    flex: 100,
  },
  checkbox: {
    margin: 0,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: DefaultColor.defaultBackgroundColor,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  optionName: {
    fontSize: 13,
  },
  price: {
    fontSize: 14,
  },
});
