// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  datePicker: {
    width: 200,
  },
  mainContainer: {
    flex: 1,
  },
  dateRangeContainer: {
    flexDirection: 'row',
  },
  resultContainer: {
    flexDirection: 'row',
  },
  departmentCategoryHeaderSection: {
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  departmentCategoryHeaderTitle: {
    fontWeight: '700',
  },
  departmentCategoryFooterSection: {
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  departmentCategoryTotalPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  departmentCategoryFooterTitle: {
    fontWeight: '700',
  },
  departmentSubCategorySection: {
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  departmentSubCategoryTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  departmentSubCategoryTitle: {
    fontWeight: '400',
  },
  departmentSubCategoryTotalPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  departmentSubCategoryTotalPrice: {
    fontWeight: '400',
  },
});
