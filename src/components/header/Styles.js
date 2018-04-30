// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
});
