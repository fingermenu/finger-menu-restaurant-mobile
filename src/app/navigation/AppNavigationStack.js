// @flow

import { StackNavigator } from 'react-navigation';
import HomeNavigationTab from './HomeNavigationTab';
import { DefaultColor } from '../../style';
import { MenuItemContainer } from '../menuItem';
import { TablesContainer } from '../tables';
import { TableSetupContainer } from '../tableSetup';
import { LandingContainer } from '../landing';
import { TableDetailContainer } from '../tableDetail';

export default StackNavigator(
  {
    Tables: {
      screen: TablesContainer,
    },
    TableSetup: {
      screen: TableSetupContainer,
    },
    TableDetail: {
      screen: TableDetailContainer,
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
