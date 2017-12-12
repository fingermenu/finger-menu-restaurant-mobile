// @flow

import { StyleSheet } from 'react-native';
import { Sizes, Color } from '../../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    // flex: 1,
    // width: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuOptionContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconContainerStyle: {
    height: 32,
    width: 32,
  },
  productItemCheckBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18.5,
    marginRight: -13,
  },
  stapleItemCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 5,
    // marginLeft: 7,
    marginRight: -15,
  },
  stapleItemName: {
    // justifyContent: 'center',
    paddingLeft: 25,
  },
  specialItemRow: {
    backgroundColor: 'white',
    // padding: 10,
  },
  stapleItemRow: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  sectionHeader: {
    width: Sizes.screenWidth,
    backgroundColor: 'transparent',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionHeaderImage: {
    width: 25,
    height: 25,
  },
  headerTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: Color.headerIconDefaultColor,
  },
  headerTitleNumberText: {
    fontSize: 12,
    color: Color.headerIconDefaultColor,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  summaryBlockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCostText: {
    color: Color.primaryColorNormal,
    fontWeight: '600',
  },
  totalSavingText: {
    color: 'red',
    fontWeight: '600',
  },
  summaryLabel: {
    color: Color.primaryFontColor,
    fontSize: 14,
  },
  addItemsBackgroundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addItemsText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'grey',
  },
  addItemsBackgroundImage: {
    width: 150,
    height: 150,
  },
  stapleItemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  stapleItemIconContainer: {
    backgroundColor: 'transparent',
  },
});
