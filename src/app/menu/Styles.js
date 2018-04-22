// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';

export default StyleSheet.create({
  container: {
    /* flex: 1, */
  },
  rowContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    backgroundColor: DefaultColor.secondaryBackgroundColor,
  },
  columnTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 15,
  },
  image: {
    width: 150,
    height: 120,
  },
  title: {
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
  },
  price: {
    fontSize: 14,
  },
  columnOrderedIconContainer: {
    paddingRight: 6,
  },
  footerContainer: {
    backgroundColor: DefaultColor.defaultBannerColor,
    padding: 10,
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
  },
});
