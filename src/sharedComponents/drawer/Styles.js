// @flow

import { StyleSheet } from 'react-native';
import { Color } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flex: 10,
  },
  profile: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: Color.primaryColorNormal,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  profileAvatar: {
    marginRight: 20,
  },
  profileDetail: {
    flexDirection: 'column',
    flex: 1,
  },
});
