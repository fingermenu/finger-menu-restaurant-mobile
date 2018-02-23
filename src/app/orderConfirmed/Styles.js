// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DefaultColor.primaryBackgroundColor,
  },
  text: {
    color: 'white',
    fontSize: 22,
    padding: 20,
  },
  topLogo: {
    paddingTop: 50,
    width: 200,
    height: 200,
  },
  image: {
    width: 100,
    height: 100,
    padding: 20,
  },
});
