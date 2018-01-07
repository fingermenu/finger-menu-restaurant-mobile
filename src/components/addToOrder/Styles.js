// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    backgroundColor: DefaultColor.defaultBannerColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
  },
});
