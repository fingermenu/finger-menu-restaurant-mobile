// @flow

import { StackNavigator } from 'react-navigation';
import { HomeNavigationTab, HomeNavigationOrdersTab } from './HomeNavigationTab';
import { DefaultColor } from '../../style';
import { MenuItem } from '../menuItem';
import { Tables } from '../tables';
import { TableSetupContainer } from '../tableSetup';
import { LandingContainer } from '../landing';
import { TableDetail } from '../tableDetail';
import { OrderConfirmedContainer } from '../orderConfirmed';
import { Pin } from '../pin/';
import { CustomersContainer } from '../customers';

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
      screen: TableDetail,
    },
    Landing: {
      screen: LandingContainer,
    },
    Home: {
      screen: HomeNavigationTab,
    },
    HomeOrders: {
      screen: HomeNavigationOrdersTab,
    },
    MenuItem: {
      screen: MenuItem,
    },
    OrderConfirmed: {
      screen: OrderConfirmedContainer,
    },
    Customers: {
      screen: CustomersContainer,
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
