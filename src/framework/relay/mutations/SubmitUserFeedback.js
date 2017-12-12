// @flow

import { commitMutation, graphql } from 'react-relay';
import { MessageType } from 'micro-business-common-react';
import * as messageBarActions from 'micro-business-common-react/src/messageBar/Actions';
import { reduxStore } from '../../../app/navigation';

const mutation = graphql`
  mutation SubmitUserFeedbackMutation($input: SubmitUserFeedbackInput!) {
    submitUserFeedback(input: $input) {
      errorMessage
    }
  }
`;

const commit = (environment, feedback) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        feedback: JSON.stringify(feedback.toJS()),
      },
    },
    updater: store => {
      const payload = store.getRootField('submitUserFeedback');
      const errorMessage = payload.getValue('errorMessage');

      if (errorMessage) {
        reduxStore.dispatch(messageBarActions.add(errorMessage, MessageType.ERROR));
      }
    },
  });
};

export default {
  commit,
};
