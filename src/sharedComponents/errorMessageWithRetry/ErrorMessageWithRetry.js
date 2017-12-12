// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Styles from './Styles';
import { Color } from '../../framework/style/DefaultStyles';

const ErrorMessageWithRetry = ({ onRetryPressed, errorMessage }) => (
  <View style={Styles.container}>
    <Text>{errorMessage}</Text>
    <Button
      raised
      style={Styles.retryButton}
      onPress={onRetryPressed}
      title="Retry"
      icon={{ name: 'cached' }}
      backgroundColor={Color.primaryColorNormal}
    />
  </View>
);

ErrorMessageWithRetry.propTypes = {
  onRetryPressed: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorMessageWithRetry;
