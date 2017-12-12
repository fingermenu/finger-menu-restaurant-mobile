// @flow

import { StyleSheet, Platform } from 'react-native';
import { Sizes, Color } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 35,
  },
  touchableContainer: {
    padding: 10,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Sizes.searchBarHeaderHeight,
    width: Platform.OS === 'ios' ? Sizes.searchBarHeaderWidth - 90 : null,
    marginRight: Platform.OS === 'ios' ? null : 10,
  },
  row: {
    padding: 10,
  },
  itemName: {
    fontSize: 10,
    textAlign: 'center',
  },
  itemNameSelected: {
    fontSize: 10,
    fontWeight: '500',
    color: '#3a69e0',
    textAlign: 'center',
  },
  itemIconContainer: {
    backgroundColor: '#EFF0F1',
  },
  itemIconSelectedContainer: {
    backgroundColor: Color.primaryColorLight,
    borderColor: Color.secondaryColorAction,
    borderWidth: 2,
  },
  sectionHeaderImage: {
    width: 25,
    height: 25,
  },
  sectionHeader: {
    width: Sizes.screenWidth,
    backgroundColor: '#E9E9EF',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerHeader: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
  },
  itemsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3a69e0',
  },
  select: {
    color: 'blue',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  addItemsHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addItemsTouchableContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  addItemsIconContainer: {
    height: Sizes.searchBarHeaderHeight,
    width: 30,
  },
});
