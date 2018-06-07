// @flow

import { createStackNavigator } from 'react-navigation';
import { DefaultColor } from '../../style';
import DailyReport from './DailyReport';

export DailyReportReducer from './Reducer';

export default createStackNavigator(
  {
    DailyReport: {
      screen: DailyReport,
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
