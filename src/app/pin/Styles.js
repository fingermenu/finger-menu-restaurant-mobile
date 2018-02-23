// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

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
    height: 50,
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
    fontSize: 25,
    fontWeight: '700',
    color: 'red',
  },
  text: {
    fontSize: 36,
    color: 'white',
  },
});
