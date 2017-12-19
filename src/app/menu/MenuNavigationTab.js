// @flow

import { TabNavigator } from 'react-navigation';
import { DefaultColor } from '../../style';
import MenuContainer from './MenuContainer';

const MenuNavigationTab = TabNavigator(
  {
    AllMenu: {
      screen: MenuContainer,
      // path: '/',
      navigationOptions: {
        tabBarLabel: 'All',
        // tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={26} style={{ color: tintColor }} />,
        headerStyle: {
          backgroundColor: DefaultColor.primaryColorNormal,
        },
      },
    },
    LunchMenu: {
      screen: MenuContainer,
      // path: '/account',
      navigationOptions: {
        tabBarLabel: 'Lunch',
        // tabBarIcon: ({ tintColor, focused }) => (
        //   <Ionicons name={focused ? 'ios-person' : 'ios-person-outline'} size={26} style={{ color: tintColor }} />
        // ),
        headerStyle: {
          backgroundColor: DefaultColor.primaryColorNormal,
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
        backgroundColor: DefaultColor.primaryColorNormal,
      },
      activeTintColor: '#FAFBFA',
    },
    backBehavior: 'none',
  },
);

export default MenuNavigationTab;
