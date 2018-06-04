// @flow

import { StackNavigator } from 'react-navigation';
import { DefaultColor } from '../../style';
import ReportsContainer from './ReportsContainer';
import { DailyReportContainer } from './dailyReport';

export default StackNavigator(
  {
    ReportsContainer: {
      screen: ReportsContainer,
    },
    DailyReport: {
      screen: DailyReportContainer,
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
