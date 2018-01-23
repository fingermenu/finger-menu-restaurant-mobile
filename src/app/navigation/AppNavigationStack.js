// @flow

import { StackNavigator } from 'react-navigation';
import HomeNavigationTab, { WrappedHomeNavigationTabWithI18NOrders } from './HomeNavigationTab';
import { DefaultColor } from '../../style';
import { MenuItemContainer } from '../menuItem';
import { Tables } from '../tables';
import { TableSetupContainer } from '../tableSetup';
import { LandingContainer } from '../landing';
import { TableDetailContainer } from '../tableDetail';
import { OrderConfirmedContainer } from '../orderConfirmed';
import { Pin } from '../pin/';

export default StackNavigator(
  {
    Pin: {
      screen: Pin,
    },
    Tables: {
      screen: Tables,
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
    HomeOrders: {
      screen: WrappedHomeNavigationTabWithI18NOrders,
    },
    MenuItem: {
      screen: MenuItemContainer,
    },
    OrderConfirmed: {
      screen: OrderConfirmedContainer,
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
