// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  iconContainerStyle: {
    height: Sizes.searchBarHeaderHeight,
    width: 40,
  },
});
