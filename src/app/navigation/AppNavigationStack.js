// @flow

import { createStackNavigator } from 'react-navigation';
import { HomeNavigationTab, HomeNavigationOrdersTab } from './HomeNavigationTab';
import { DefaultColor } from '../../style';
import { MenuItem } from '../menuItem';
import { Tables } from '../tables';
import { TableSetupContainer } from '../tableSetup';
import { LandingContainer } from '../landing';
import { TableDetail } from '../tableDetail';
import { OrderConfirmedContainer } from '../orderConfirmed';
import { Pin } from '../pin';
import { CustomersContainer } from '../customers';

export default createStackNavigator(
  {
    Pin: {
      screen: Pin,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
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
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
    Home: {
      screen: HomeNavigationTab,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
    HomeOrders: {
      screen: HomeNavigationOrdersTab,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
    MenuItem: {
      screen: MenuItem,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
    OrderConfirmed: {
      screen: OrderConfirmedContainer,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
    Customers: {
      screen: CustomersContainer,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
