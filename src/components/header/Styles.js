// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor, Sizes } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchableContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Sizes.iconWidth,
    height: Sizes.iconHeight,
    paddingRight: 5,
  },
  guestName: {
    color: DefaultColor.defaultBackgroundColor,
  },
});
