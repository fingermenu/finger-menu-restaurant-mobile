// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style/DefaultStyles';

export default StyleSheet.create({
  optionContainer: {
    flex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: DefaultColor.secondaryFontColor,
  },
});
