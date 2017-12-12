// @flow

import { StyleSheet } from 'react-native';
import { Color } from '../../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {},
  membersContainer: {
    padding: 20,
  },
  avatarContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listNameContainer: {
    backgroundColor: Color.primaryColorNormal,
  },
  membersLabel: {
    fontWeight: 'bold',
    color: 'grey',
  },
  memberName: {
    paddingLeft: 10,
    fontSize: 16,
  },
  invite: {
    paddingLeft: 9,
    fontSize: 16,
    color: Color.primaryColorDark,
  },
  listNameLabel: {
    fontSize: 12,
    padding: 20,
    color: 'white',
  },
  profileAvatar: {
    paddingTop: 10,
  },
  listNameInput: {
    color: Color.primaryFontColor,
  },
});
