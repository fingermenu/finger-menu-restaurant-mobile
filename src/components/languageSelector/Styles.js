// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  iconContainer: {
    backgroundColor: '#EFF0F1',
  },
  selectedIconContainer: {
    backgroundColor: DefaultColor.defaultThemeColor,
    borderColor: DefaultColor.defaultBackgroundColor,
    borderWidth: 2,
  },
});
