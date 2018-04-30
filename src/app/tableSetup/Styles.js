// @flow

import { StyleSheet } from 'react-native';
import ScreenSize from '../../style/ScreenSizeHelper';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  labelContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    flex: 50,
  },
  numberText: {
    fontSize: 20,
    fontWeight: '500',
  },
  tableBadgeContainer: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 50,
    paddingRight: 50,
  },
  tableBadgeWrapper: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  tableText: {
    color: 'orange',
    fontSize: 20,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    width: ScreenSize({ xs: 125, s: 150, l: 175, xl: 175 }, 200),
  },
});
