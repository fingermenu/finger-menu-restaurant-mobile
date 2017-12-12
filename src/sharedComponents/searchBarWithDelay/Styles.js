// @flow

import { StyleSheet } from 'react-native';
import { Color } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  searchInput: {
    backgroundColor: 'transparent',
    color: Color.headerIconDefaultColor,
  },
});
