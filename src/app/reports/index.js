// @flow

import { StackNavigator } from 'react-navigation';
import { DefaultColor } from '../../style';
import DailyReport from './DailyReport';
import { Pin } from '../pin';

export DailyReportReducer from './Reducer';

export default StackNavigator(
  {
    DailyReport: {
      screen: DailyReport,
    },
    Pin: {
      screen: Pin,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
  },
  {
    cardStyle: {
      backgroundColor: DefaultColor.defaultBackgroundColor,
    },
  },
);
