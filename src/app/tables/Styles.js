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
  tableSummaryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  tableOuterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableItemContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tableBadgeContainer: {
    padding: 25,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableBadgeEmpty: {
    backgroundColor: 'grey',
  },
  tableBadgeTaken: {
    backgroundColor: 'green',
  },
  tableBadgeReserve: {
    backgroundColor: 'orange',
  },
  tableBadgePaid: {
    backgroundColor: '#8AC8F5',
  },
  tableBadgeWrapper: {
    paddingLeft: 20,
    // paddingTop: 20,
    paddingBottom: 20,
  },
  tableText: {
    color: 'black',
    fontSize: 30,
  },
  tableButton: {
    width: 100,
    margin: 5,
  },
  tableLegendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerNameText: {
    width: 50,
  },
});
