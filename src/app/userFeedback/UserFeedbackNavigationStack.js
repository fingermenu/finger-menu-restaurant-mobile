// @flow

import { StackNavigator } from 'react-navigation';
import UserFeedbackContainer from './UserFeedbackContainer';

export default StackNavigator({
  Feedback: {
    screen: UserFeedbackContainer,
  },
});
