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
  departmentCategoryTotalSaleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  departmentCategoryTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  departmentCategoryQuantityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  departmentCategoryFooterTitle: {
    fontWeight: '700',
  },
  departmentCategoryFooterTotalSale: {
    fontWeight: '700',
  },
  departmentCategoryFooterQuantity: {
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
  departmentSubCategoryTotalSale: {
    fontWeight: '400',
  },
  departmentSubCategoryQuantity: {
    fontWeight: '400',
  },
  departmentSubCategoryQuantityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  departmentSubCategoryTotalSaleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
