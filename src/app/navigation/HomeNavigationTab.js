// @flow
import React from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DefaultColor } from '../../style';
import { MenuNavigationTab } from '../menu';
import { Account } from '../account';

const HomeNavigationTab = TabNavigator(
  {
    Menus: {
      screen: MenuNavigationTab,
      path: '/',
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={26} style={{ color: tintColor }} />,
        headerStyle: {
          backgroundColor: DefaultColor.primaryColorNormal,
        },
      },
    },
    Account: {
      screen: Account,
      path: '/account',
      navigationOptions: {
        tabBarLabel: 'Account',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name={focused ? 'ios-person' : 'ios-person-outline'} size={26} style={{ color: tintColor }} />
        ),
        headerStyle: {
          backgroundColor: DefaultColor.primaryColorNormal,
        },
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      tabStyle: {
        height: 49,
      },
      labelStyle: {
        fontSize: 9,
      },
      iconStyle: {
        marginBottom: 0,
      },
      style: {
        backgroundColor: DefaultColor.primaryBackgroundColor, //'#3DC62A',
      },
      inactiveTintColor: DefaultColor.primaryColorDark,
      activeTintColor: DefaultColor.primaryColorNormal, //'#FAFBFA',
    },
    backBehavior: 'none',
  },
);

export default HomeNavigationTab;
