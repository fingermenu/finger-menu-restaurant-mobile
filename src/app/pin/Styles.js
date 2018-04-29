// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor, ScreenSize } from '../../style';

export default StyleSheet.create({
  container: {
    backgroundColor: DefaultColor.primaryBackgroundColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinContainer: {
    height: ScreenSize({ s: 40, l: 45, xl: 50 }, 36),
    borderWidth: 2,
    borderColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinPadContainer: {
    height: 400,
  },
  errorText: {
    color: 'red',
  },
  text: {
    color: 'white',
  },
});
