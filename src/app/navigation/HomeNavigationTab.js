// @flow

import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DefaultColor } from '../../style';
import i18n from '../../i18n';
import { HeaderContainer } from '../../components/header';
import { Menus } from '../menus';
import { InfoContainer } from '../info';
import { Orders } from '../orders';
import { Account } from '../account';

const tabScreens = {
  Menus: {
    screen: Menus,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={30} style={{ color: tintColor }} />,
    },
  },
  Info: {
    screen: InfoContainer,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-information-circle' : 'ios-information-circle-outline'} size={30} style={{ color: tintColor }} />
      ),
    },
  },
  Orders: {
    screen: Orders,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-list-box' : 'ios-list-box-outline'} size={30} style={{ color: tintColor }} />
      ),
    },
  },
  Assist: {
    screen: Account,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-notifications' : 'ios-notifications-outline'} size={30} style={{ color: tintColor }} />
      ),
    },
  },
};

const tabConfig = {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: false,
  lazy: true,
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    tabStyle: {
      height: 49,
    },
    labelStyle: {
      fontSize: 9,
    },
    iconStyle: {
      marginTop: 2,
      marginBottom: 0,
    },
    style: {
      backgroundColor: DefaultColor.defaultHomeTabBackgroundColor,
    },
    inactiveTintColor: DefaultColor.defaultThemeColor,
    activeTintColor: DefaultColor.defaultBannerColor,
  },
  backBehavior: 'none',
};

const createHomeNavigationTab = ({ initialRouteName } = {}) => {
  return class HomeNavigation extends Component {
    static navigationOptions = () => ({
      headerTitle: <HeaderContainer />,
      headerTintColor: DefaultColor.headerIconDefaultColor,
      headerStyle: {
        backgroundColor: DefaultColor.defaultBannerColor,
      },
    });

    render = () => {
      const HomeNavigationTab = TabNavigator(tabScreens, { ...tabConfig, initialRouteName });

      return <HomeNavigationTab screenProps={{ t: i18n.getFixedT() }} />;
    };
  };
};

export const HomeNavigationTab = createHomeNavigationTab();
export const HomeNavigationOrdersTab = createHomeNavigationTab({ initialRouteName: 'Orders' });
