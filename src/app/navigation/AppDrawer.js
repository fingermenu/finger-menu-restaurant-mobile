// @flow
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import AppNavigationStack from './AppNavigationStack';
import { AppDrawerMenuContainer } from '../../components/drawer';

export default DrawerNavigator(
  {
    Home: {
      screen: AppNavigationStack,
      navigationOptions: () => ({ drawerLabel: 'Tables', drawerIcon: () => <Icon name="home" type="material-community" /> }),
    },
  },
  { contentComponent: AppDrawerMenuContainer },
);
