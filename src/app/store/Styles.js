// @flow

import { StyleSheet } from 'react-native';
import { Color } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  productImage: {
    height: 300,
    width: 400,
  },
  storeInfoHeaderContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Color.secondaryColorAction,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    padding: 10,
  },
  storeInfoContainer: {},
  storeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeInfoRowText: {
    paddingLeft: 10,
  },
  link: {
    color: 'blue',
  },
});
