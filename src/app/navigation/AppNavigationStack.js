// @flow

import { StackNavigator } from 'react-navigation';
import HomeNavigationTab from './HomeNavigationTab';
import { DefaultColor } from '../../style';
import { MenuItemContainer } from '../menuItem';
export default StackNavigator(
  {
    Home: {
      screen: HomeNavigationTab,
    },
    MenuItem: {
      screen: MenuItemContainer,
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
