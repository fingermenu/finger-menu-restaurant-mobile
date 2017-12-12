// @flow

import { StyleSheet } from 'react-native';
import { Color } from '../../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  productImage: {
    height: 300,
    width: 400,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollViewContainer: {
    marginBottom: 20,
  },
  addProductContainer: {
    justifyContent: 'space-between',
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#262626',
  },
  productTitleContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  storeInfoContainer: {
    flexDirection: 'row',
  },
  storeDetail: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    color: Color.primaryFontColor,
    fontSize: 20,
    marginBottom: 5,
  },
  productDescription: {
    color: Color.primaryFontColor,
    paddingBottom: 10,
  },
  productPriceContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  savingPercentage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'right',
    marginLeft: 10,
  },
  savingPercentageSmall: {
    fontSize: 12,
    color: 'red',
    textAlign: 'right',
    marginLeft: 10,
  },
  priceToDisplay: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Color.primaryColorNormal,
    textAlign: 'right',
  },
  icon: {
    margin: 5,
  },
  link: {
    color: 'blue',
  },
  addButton: {
    height: 10,
  },
});
