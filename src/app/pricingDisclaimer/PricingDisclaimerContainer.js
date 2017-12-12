// @flow

import React, { Component } from 'react';
import PricingDisclaimer from './PricingDisclaimer';
import { MainMenuContainer } from '../../sharedComponents/mainMenu';
import { Color } from '../../framework/style/DefaultStyles';

class PricingDisclaimerContainer extends Component {
  static navigationOptions = {
    headerLeft: <MainMenuContainer />,
    headerTitle: 'Pricing Disclaimer',
    headerTintColor: Color.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
  };

  render = () => {
    return <PricingDisclaimer />;
  };
}

export default PricingDisclaimerContainer;
