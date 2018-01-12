// @flow

import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import { DefaultColor } from '../../style';
import MenuContainer from './MenuContainer';
// import RecommendMenuContainer from '../recommendMenu/RecommendMenuContainer';

const MenuNavigationTab = TabNavigator(
  {
    // RecommendMenu: {
    //   screen: RecommendMenuContainer,
    //   navigationOptions: {
    //     tabBarLabel: 'Recommend',
    //     headerStyle: {
    //       backgroundColor: DefaultColor.defaultBannerColor,
    //     },
    //   },
    // },
    AllMenu: {
      screen: MenuContainer,
      navigationOptions: {
        tabBarLabel: 'All',
        headerStyle: {
          backgroundColor: DefaultColor.defaultBannerColor,
        },
      },
    },
    LunchMenu: {
      screen: MenuContainer,
      navigationOptions: {
        tabBarLabel: 'Lunch',
        headerStyle: {
          backgroundColor: DefaultColor.defaultBannerColor,
        },
      },
    },
  },
  {
    lazy: true,
    tabBarPosition: 'top',
    ...TabNavigator.Presets.AndroidTopTabs,
    tabBarOptions: {
      scrollEnabled: true,
      showIcon: false,
      tabStyle: {
        width: 150,
      },
      labelStyle: {
        fontSize: 13,
      },
      iconStyle: {
        marginBottom: 0,
      },
      style: {
        backgroundColor: DefaultColor.defaultBannerColor,
      },
      activeTintColor: '#FAFBFA',
    },
    backBehavior: 'none',
  },
);

class MenuNavigationTabWrapper extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: screenProps.t('home.label'),
  });

  render = () => {
    return <MenuNavigationTab />;
  };
}

export default MenuNavigationTabWrapper;
