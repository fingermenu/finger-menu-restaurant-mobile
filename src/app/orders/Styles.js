// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  rowTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    color: DefaultColor.defaultThemeColor,
  },
  quantityContainer: {
    flex: 10,
  },
  titleContainer: {
    flex: 100,
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  extraOptions: {
    fontSize: 18,
  },
  price: {
    fontSize: 14,
  },
});
