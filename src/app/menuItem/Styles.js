// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  descriptionContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
