// @flow

import { StyleSheet } from 'react-native';
import { Color } from '../../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primaryBackgroundColor,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    paddingLeft: 5,
  },
  shoppingListRowSeparator: {
    height: 10,
    backgroundColor: 'transparent',
  },
  shoppingListRow: {
    backgroundColor: 'white',
    padding: 5,
  },
  shoppingListRowContainer: {
    height: 40,
  },
  shoppingListRowName: {
    fontSize: 16,
    fontWeight: '500',
    color: Color.primaryFontColor,
  },
});

export const optionsStyles = {
  optionsContainer: {
    padding: 5,
    width: 150,
  },
  optionsWrapper: {},
  optionWrapper: {
    margin: 5,
  },
  optionTouchable: {
    underlayColor: Color.touchableIconPressColor,
    activeOpacity: 70,
  },
  optionText: {
    color: 'brown',
  },
};
