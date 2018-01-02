// @flow
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { translate } from 'react-i18next';
import { DefaultColor } from '../../style';
import { MenuNavigationTabWrapper } from '../menu';
import { Account } from '../account';
import i18n from '../../i18n';
import { HeaderContainer } from '../../components/header';
import { InfoContainer } from '../info';
import { OrdersContainer } from '../orders';

const HomeNavigationTab = TabNavigator(
  {
    Menus: {
      screen: MenuNavigationTabWrapper,
      path: '/',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={26} style={{ color: tintColor }} />,
      },
    },
    Info: {
      screen: InfoContainer,
      path: '/',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name={focused ? 'ios-information-circle' : 'ios-information-circle-outline'} size={26} style={{ color: tintColor }} />
        ),
      },
    },
    Orders: {
      screen: OrdersContainer,
      path: '/',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name={focused ? 'ios-list-box' : 'ios-list-box-outline'} size={26} style={{ color: tintColor }} />
        ),
      },
    },
    Assist: {
      screen: Account,
      path: '/account',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name={focused ? 'ios-notifications' : 'ios-notifications-outline'} size={26} style={{ color: tintColor }} />
        ),
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

// const WrappedHomeNavigationTab = () => {
//   return <HomeNavigationTab screenProps={{ t: i18n.getFixedT()}} />;
// };

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

export default WrappedHomeNavigationTabWithI18N;
