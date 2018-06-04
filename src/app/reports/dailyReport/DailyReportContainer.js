// @flow

import React, { Component } from 'react';
import DailyReportView from './DailyReportView';
import { DefaultColor } from '../../../style';

class DailyReportContainer extends Component {
  static navigationOptions = {
    headerTitle: 'Daily Report',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  render = () => {
    return <DailyReportView />;
  };
}

export default DailyReportContainer;
