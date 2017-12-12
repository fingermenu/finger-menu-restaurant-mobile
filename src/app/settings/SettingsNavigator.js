// @flow

import { StackNavigator } from 'react-navigation';
import SettingsContainer from './SettingsContainer';

export default StackNavigator({
  Settings: {
    screen: SettingsContainer,
  },
});
