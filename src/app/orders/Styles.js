// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor, ScreenSize } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  orderRowContainer: {
    padding: 15,
    backgroundColor: DefaultColor.secondaryBackgroundColor,
  },
  rowTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  emptyOrdersContainer: {
    paddingTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  paid: {
    fontSize: 18,
    fontWeight: '600',
    color: DefaultColor.actionButtonColor,
    paddingRight: 10,
  },
  quantityContainer: {
    flex: 10,
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 100,
  },
  image: {
    marginRight: 5,
    width: ScreenSize({ xs: 30, s: 50, l: 75, xl: 100 }, 100),
    height: ScreenSize({ xs: 30, s: 50, l: 75, xl: 100 }, 100),
  },
  extraOptions: {
    fontSize: 18,
  },
  popupDialogContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupDialogButtonContainer: {
    paddingTop: 20,
  },
  popupDialogText: {
    justifyContent: 'center',
  },
  popupDialogButton: {
    width: 120,
    backgroundColor: DefaultColor.actionButtonColor,
  },
  buttonContainer: {
    padding: 30,
  },
  notesContainer: {
    marginBottom: 30,
  },
  placeOrderContainer: {
    marginBottom: 5,
  },
});
