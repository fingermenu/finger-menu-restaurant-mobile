// @flow

import { StackNavigator } from 'react-navigation';
import HomeNavigationTab from './HomeNavigationTab';
import { DefaultColor } from '../../style';

export default StackNavigator(
  {
    Home: {
      screen: HomeNavigationTab,
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.primaryBackgroundColor,
    },
  },
);
