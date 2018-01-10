// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    backgroundColor: DefaultColor.defaultBannerColor,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
  },
});
