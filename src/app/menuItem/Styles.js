// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../style/DefaultStyles';

export default StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    // padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Sizes.screenWidth,
    height: 200,
  },
  title: {
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
  },
  price: {
    fontSize: 14,
  },
});
