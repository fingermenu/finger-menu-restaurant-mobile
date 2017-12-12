// @flow

import { StyleSheet } from 'react-native';
import { Color, Sizes } from '../../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // justifyContent: 'center',
    height: Sizes.searchBarHeaderHeight,
    width: Sizes.searchBarHeaderWidth,
  },
  headerOptions: {
    flexDirection: 'row',
  },
  menuOption: {
    flexDirection: 'row',
  },
  productListItemRow: {
    backgroundColor: 'white',
    padding: 10,
  },
  productListItemRowContainer: {
    flexDirection: 'row',
  },
  productListItemRowSelected: {
    backgroundColor: 'white',
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
  },
  storeImage: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  offerEndDate: {
    color: 'red',
  },
  productSize: {
    textAlign: 'right',
    fontSize: 12,
  },
  savingPercentage: {
    fontSize: 10,
    color: 'red',
    textAlign: 'right',
  },
  storeName: {
    fontSize: 12,
    color: '#666666',
  },
  subTitle: {
    color: Color.primaryFontColor,
    fontSize: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
  priceToDisplay: {
    fontWeight: 'bold',
    color: Color.primaryColorNormal,
    textAlign: 'right',
  },
  viewProductIconContainerStyle: {
    height: 60,
    width: 30,
  },
  iconContainerStyle: {
    height: Sizes.searchBarHeaderHeight,
    width: 40,
  },
  noMatchingProductContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchingProductText: {
    fontSize: 18,
    fontWeight: '700',
    color: Color.primaryFontColor,
  },
  itemAddedText: {
    color: Color.secondaryColorAction,
    fontWeight: '600',
  },
});
