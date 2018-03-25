// @flow

/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { translate } from 'react-i18next';
import { DefaultColor } from '../../style';
import { Account } from '../account';
import i18n from '../../i18n';
import { HeaderContainer } from '../../components/header';
import { InfoContainer } from '../info';
import { Orders } from '../orders';
import { Menus } from '../menus';

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

const HomeNavigationTab = TabNavigator(tabScreens, tabConfig);
const HomeNavigationOrdersTab = TabNavigator(tabScreens, { ...tabConfig, initialRouteName: 'Orders' });

class WrappedHomeNavigationTab extends Component {
  static navigationOptions = () => ({
    headerTitle: <HeaderContainer />,
  });

  render = () => {
    return <HomeNavigationTab screenProps={{ t: i18n.getFixedT() }} />;
  };
}

const WrappedHomeNavigationTabWithI18N = translate('translation', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedHomeNavigationTab);

// TODO: Following is a workaround of navigating parent tabs within sub stack navigation, see
// https://github.com/react-navigation/react-navigation/issues/1715, from appwudo commented on 23 Sep 2017 comment
class WrappedHomeNavigationOrdersTab extends Component {
  static navigationOptions = () => ({
    headerTitle: <HeaderContainer />,
  });

  render = () => {
    return <HomeNavigationOrdersTab screenProps={{ t: i18n.getFixedT() }} />;
  };
}

export const WrappedHomeNavigationTabWithI18NOrders = translate('translation', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedHomeNavigationOrdersTab);

export default WrappedHomeNavigationTabWithI18N;
