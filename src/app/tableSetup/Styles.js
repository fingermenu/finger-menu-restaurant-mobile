// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
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
  headerText: {
    fontSize: 30,
    fontWeight: '700',
  },
  numberText: {
    fontSize: 20,
    fontWeight: '500',
  },
  tableBadgeContainer: {
    padding: 25,
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
  button: {
    width: 200,
  },
});
