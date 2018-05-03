// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  iconContainer: {
    backgroundColor: DefaultColor.secondaryBackgroundColor,
  },
  selectedIconContainer: {
    backgroundColor: DefaultColor.primaryBackgroundColor,
    borderWidth: 1,
  },
  menuOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconTextContainer: {
    paddingLeft: 35,
  },
  selectedIconText: {
    color: 'white',
  },
  iconText: {
    color: DefaultColor.defaultFontColor,
  },
});
