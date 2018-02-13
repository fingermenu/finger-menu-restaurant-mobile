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
    fontSize: 26,
  },
  sectionHeader: {
    padding: 5,
    backgroundColor: DefaultColor.secondaryBackgroundColor,
  },
  optionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: DefaultColor.secondaryBackgroundColor,
  },
  checkboxContainer: {
    flex: 10,
  },
  optionContainer: {
    flex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionName: {
    fontSize: 26,
  },
  price: {
    fontSize: 26,
    color: '#4CC0B6',
  },
});
