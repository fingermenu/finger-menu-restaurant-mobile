// @flow
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import AppNavigationStack from './AppNavigationStack';
import { SettingsNavigator } from '../settings';
import { Icon } from 'react-native-elements';
import AppDrawerMenuContainer from '../../sharedComponents/drawer/AppDrawerMenuContainer';
import { PricingDisclaimerNavigator } from '../pricingDisclaimer';
import { Color } from '../../framework/style/DefaultStyles';
import { UserFeedbackNavigationStack } from '../userFeedback';

export default DrawerNavigator(
  {
    Home: {
      screen: AppNavigationStack,
      navigationOptions: {
        drawerLabel: 'Home',
        drawerIcon: () => <Icon name="home" type="material-community" color={Color.primaryColorNormal} />,
      },
    },
    PricingDisclaimer: {
      screen: PricingDisclaimerNavigator,
      navigationOptions: {
        drawerLabel: 'Pricing Disclaimer',
        drawerIcon: () => <Icon name="new-releases" color="#517fa4" type="material-icons" />,
      },
    },
    Settings: {
      screen: SettingsNavigator,
      navigationOptions: {
        drawerLabel: 'Settings',
        drawerIcon: () => <Icon name="ios-settings" type="ionicon" color={Color.secondaryColorAction} />,
      },
    },
    UserFeedback: {
      screen: UserFeedbackNavigationStack,
      navigationOptions: {
        drawerLabel: 'Give Feedback',
        drawerIcon: () => <Icon name="ios-megaphone" type="ionicon" color={Color.secondaryColorAction} />,
      },
    },
  },
  {
    contentComponent: AppDrawerMenuContainer,
  },
);
