// @flow

import { StyleSheet } from 'react-native';
import { Sizes } from '../../style/DefaultStyles';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColor.secondaryBackgroundColor,
  },
  descriptionContainer: {
    padding: 10,
    backgroundColor: DefaultColor.secondaryBackgroundColor,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F3F6FB',
  },
  image: {
    width: Sizes.screenWidth,
    height: 300,
  },
  title: {
    fontWeight: '700',
  },
  description: {
    fontSize: 20,
    color: DefaultColor.defaultFontColorDisabled,
  },
  price: {
    fontSize: 20,
    color: DefaultColor.secondaryFontColor,
  },
});
