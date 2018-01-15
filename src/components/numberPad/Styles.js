// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberContainer: {
    padding: 5,
  },
  touchableContainer: {
    // padding: 10,
    // width: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#EFF0F1',
  },
  selectedIconContainer: {
    backgroundColor: DefaultColor.defaultThemeColor,
    borderColor: DefaultColor.defaultBackgroundColor,
    borderWidth: 2,
  },
});
