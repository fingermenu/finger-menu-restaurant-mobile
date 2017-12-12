// @flow
import React from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BrowseProductsNavigationTab } from '../products';
import { Color } from '../../framework/style/DefaultStyles';
import { ProductsHeaderContainer } from '../products';
import { ShoppingList } from '../shoppingList';

const HomeNavigationTab = TabNavigator(
  {
    ShoppingList: {
      screen: ShoppingList,
      path: '/',
      navigationOptions: {
        tabBarLabel: 'Shopping List',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons name={focused ? 'ios-list-box' : 'ios-list-box-outline'} size={26} style={{ color: tintColor }} />
        ),
        // header: null,
        headerStyle: {
          backgroundColor: Color.primaryColorNormal,
        },
      },
    },
    Browse: {
      screen: BrowseProductsNavigationTab,
      path: '/browse',
      navigationOptions: {
        tabBarLabel: 'Browse',
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-cart' : 'ios-cart-outline'} size={26} style={{ color: tintColor }} />,
        headerTitle: <ProductsHeaderContainer />,
        headerStyle: {
          backgroundColor: Color.primaryColorNormal,
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
        backgroundColor: Color.primaryBackgroundColor, //'#3DC62A',
      },
      inactiveTintColor: Color.primaryColorDark,
      activeTintColor: Color.primaryColorNormal, //'#FAFBFA',
    },
    backBehavior: 'none',
  },
);

export default HomeNavigationTab;
