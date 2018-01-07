// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableTextContainer: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Container: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
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
  tableLegendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
