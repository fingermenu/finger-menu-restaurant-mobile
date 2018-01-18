// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
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
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableBadgeContainer: {
    padding: 25,
  },
  tableBadgeEmpty: {
    backgroundColor: 'grey',
  },
  tableBadgeTaken: {
    backgroundColor: 'red',
  },
  tableBadgeReserve: {
    backgroundColor: 'yellow',
  },
  tableBadgePaid: {
    backgroundColor: 'green',
  },
  tableBadgeWrapper: {
    paddingLeft: 20,
    // paddingTop: 20,
    paddingBottom: 20,
  },
  tableText: {
    color: 'orange',
    fontSize: 36,
  },
  tableLegendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
