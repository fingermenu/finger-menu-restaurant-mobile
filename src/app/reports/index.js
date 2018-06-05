// @flow

import { StackNavigator } from 'react-navigation';
import { DefaultColor } from '../../style';
import DailyReport from './DailyReport';

export default StackNavigator(
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
