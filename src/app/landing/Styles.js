// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../style';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: Sizes.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 36,
  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 5,
    // backgroundColor: '#3DC62A',
  },
});
