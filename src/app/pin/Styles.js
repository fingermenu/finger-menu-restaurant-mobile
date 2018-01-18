// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinContainer: {
    height: 50,
    borderWidth: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinPadContainer: {
    height: 300,
  },
  errorText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'red',
  },
  text: {
    fontSize: 25,
  },
});
