// @flow
import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import AppNavigationStack from './AppNavigationStack';
import { AppDrawerMenuContainer } from '../../components/drawer';
import Reports from '../reports';

export default createDrawerNavigator(
  {
    Home: {
      screen: AppNavigationStack,
      navigationOptions: () => ({ drawerLabel: 'Tables', drawerIcon: () => <Icon name="seat-recline-normal" type="material-community" /> }),
    },
    Reports: {
      screen: Reports,
      navigationOptions: () => ({ drawerLabel: 'Daily Report', drawerIcon: () => <Icon name="report" type="material-icon" /> }),
    },
  },
  { contentComponent: AppDrawerMenuContainer },
);
