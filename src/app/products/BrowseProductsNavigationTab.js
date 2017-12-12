// @flow

import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Products } from '../products';
import { Color } from '../../framework/style/DefaultStyles';

const BrowseProductsNavigationTab = TabNavigator(
  {
    All: {
      screen: props => <Products {...props} />,
      navigationOptions: {
        tabBarLabel: 'All',
      },
      path: '/all',
    },
    Groceries: {
      screen: props => (
        <Products
          {...props}
          defaultCategories={[
            'baby-care-toys',
            'bakery',
            'baking-cooking',
            'beauty-personal-care',
            'biscuits-crackers',
            'books-music-movies',
            'breakfast-foods',
            'canned-prepared-foods',
            'chocolate-sweets-snacks',
            'cleaning-homecare',
            'deli-chilled-foods',
            'drinks-hot-cold',
            'electronics-gaming-giftcards',
            'frozen-foods',
            'fruit-vegetables',
            'garden',
            'health-wellness',
            'home-kitchenware-manchester',
            'liquor-beer-cider',
            'liquor-wine',
            'meal-ingredients',
            'meat-seafood',
            'office-craft',
            'pet-care',
            'sports-outdoors',
            'toys-party',
          ]}
        />
      ),
      navigationOptions: {
        tabBarLabel: 'Groceries',
      },
      path: '/groceries',
    },
    Health: {
      screen: props => <Products {...props} defaultCategories={['health-wellness']} />,
      navigationOptions: {
        tabBarLabel: 'Health',
      },
      path: '/health',
    },
    FruitAndVege: {
      screen: props => <Products {...props} defaultCategories={['fruit-vegetables']} />,
      navigationOptions: {
        tabBarLabel: 'Fruit & Vege',
      },
      path: '/fruitAndVege',
    },
    Meat: {
      screen: props => <Products {...props} defaultCategories={['meat-seafood']} />,
      navigationOptions: {
        tabBarLabel: 'Meat',
      },
      path: '/meat',
    },
  },
  {
    tabBarPosition: 'top',
    ...TabNavigator.Presets.AndroidTopTabs,
    lazy: true,
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
        backgroundColor: Color.primaryColorNormal,
      },
      activeTintColor: '#FAFBFA',
    },
    backBehavior: 'none',
  },
);

export default BrowseProductsNavigationTab;
