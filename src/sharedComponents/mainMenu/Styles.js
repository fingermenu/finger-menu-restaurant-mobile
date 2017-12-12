// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerStyle: {
    height: Sizes.searchBarHeaderHeight,
    width: Sizes.searchBarHeaderHeight,
  },
});
