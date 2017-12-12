// @flow

import React, { Component } from 'react';
import Disclaimer from './Disclaimer';
import { MainMenuContainer } from '../../sharedComponents/mainMenu';
import { Color } from '../../framework/style/DefaultStyles';

class DisclaimerContainer extends Component {
  static navigationOptions = {
    headerLeft: <MainMenuContainer />,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
  };

  render = () => {
    return <Disclaimer />;
  };
}

export default DisclaimerContainer;
