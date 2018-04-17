// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style/DefaultStyles';

export default StyleSheet.create({
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
    color: DefaultColor.secondaryFontColor,
  },
});
