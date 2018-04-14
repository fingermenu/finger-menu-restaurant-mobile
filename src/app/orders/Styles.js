// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

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
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    color: DefaultColor.secondaryFontColor,
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
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  extraOptions: {
    fontSize: 18,
  },
  price: {
    fontSize: 20,
    color: DefaultColor.secondaryFontColor,
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
  menuItemNotes: {
    fontSize: 18,
    fontWeight: '600',
  },
  notesContainer: {
    marginBottom: 30,
  },
  placeOrderContainer: {
    marginBottom: 30,
  },
});
