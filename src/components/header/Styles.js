// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor, Sizes } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
  languageMenuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  restaurantNameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  restaurantName: {
    color: DefaultColor.defaultBackgroundColor,
  },
  guestName: {
    color: DefaultColor.defaultBackgroundColor,
  },
});
