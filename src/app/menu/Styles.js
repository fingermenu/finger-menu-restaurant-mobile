// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor } from '../../style';
import ScreenSize from '../../style/ScreenSizeHelper';

export default StyleSheet.create({
  container: {
    flex: 1,
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
    width: ScreenSize({ xs: 50, s: 80, l: 100, xl: 150 }, 150),
    height: ScreenSize({ xs: 35, s: 60, l: 80, xl: 120 }, 120),
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
  dishTypeText: {
    fontWeight: '700',
    fontSize: 26,
  },
});
