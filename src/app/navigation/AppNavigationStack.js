// @flow

import { StackNavigator } from 'react-navigation';
import HomeNavigationTab from './HomeNavigationTab';
import { DefaultColor } from '../../style';
import { MenuItemContainer } from '../menuItem';
import { TablesContainer } from '../tables';
import { TableSetupContainer } from '../tableSetup';
import LandingContainer from '../landing/LandingContainer';

export default StackNavigator(
  {
    Tables: {
      screen: TablesContainer,
    },
    TableSetup: {
      screen: TableSetupContainer,
    },
    Landing: {
      screen: LandingContainer,
    },
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
