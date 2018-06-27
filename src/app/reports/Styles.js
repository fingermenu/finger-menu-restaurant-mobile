// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  dateRangeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  resultContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  departmentCategorySection: {
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  departmentCategoryTitle: {
    fontWeight: '700',
  },
  departmentSubCategorySection: {
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  departmentSubCategoryTitle: {
    fontWeight: '400',
  },
});
