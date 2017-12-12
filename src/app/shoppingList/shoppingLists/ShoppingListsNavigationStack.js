// @flow

import { StackNavigator } from 'react-navigation';
import ShoppingList from '../shoppingList/ShoppingList';
import ShoppingLists from './ShoppingLists';

const ShoppingListsNavigationStack = StackNavigator(
  {
    ShoppingLists: {
      screen: ShoppingLists,
    },
    ShoppingList: {
      screen: ShoppingList,
    },
  },
  {
    cardStyle: {
      backgroundColor: 'white',
    },
  },
);

export default ShoppingListsNavigationStack;
