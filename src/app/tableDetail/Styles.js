// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    alignItems: 'center',
    padding: 10,
    marginBottom: 100,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  rowContainer: {
    // flex: 1,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  paymentSummaryContainer: {
    flexDirection: 'column',
    backgroundColor: '#f6ddab',
  },
  paymentSummaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  paymentSummaryBalanceRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyOrdersContainer: {
    paddingTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetTableDialogContainer: {
    padding: 10,
  },
  customPayDialogContainer: {
    padding: 10,
    flex: 1,
  },
  centeredRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resetTableDialogText: {
    justifyContent: 'center',
  },
  button: {
    width: 120,
    backgroundColor: DefaultColor.actionButtonColor,
  },
  buttonContainer: {
    padding: 30,
  },
  rePrintForKitchenTableDialogContainer: {
    padding: 10,
  },
  rePrintForKitchenTableDialogText: {
    justifyContent: 'center',
  },
});
