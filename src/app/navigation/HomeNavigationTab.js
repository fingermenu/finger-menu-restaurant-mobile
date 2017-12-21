// @flow
import React from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { translate } from 'react-i18next';
import { DefaultColor } from '../../style';
import { MenuNavigationTabWrapper } from '../menu';
import { Account } from '../account';
import i18n from '../../i18n';

const HomeNavigationTab = TabNavigator(
  {
    Menus: {
      screen: MenuNavigationTabWrapper,
      path: '/',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={26} style={{ color: tintColor }} />,
        headerStyle: {
          backgroundColor: DefaultColor.defaultBannerColor,
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
          backgroundColor: DefaultColor.defaultBannerColor,
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
        backgroundColor: DefaultColor.defaultBackgroundColor,
      },
      inactiveTintColor: DefaultColor.defaultThemeColor,
      activeTintColor: DefaultColor.defaultBannerColor,
    },
    backBehavior: 'none',
  },
);

const WrappedHomeNavigationTab = () => {
  return <HomeNavigationTab screenProps={{ t: i18n.getFixedT() }} />;
};

const WrappedHomeNavigationTabWithI18N = translate('translation', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedHomeNavigationTab);

export default WrappedHomeNavigationTabWithI18N;
