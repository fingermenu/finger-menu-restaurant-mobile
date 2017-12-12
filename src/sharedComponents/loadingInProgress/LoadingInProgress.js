// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { Color } from '../../framework/style/DefaultStyles';
import Styles from './Styles';

const LoadingInProgress = ({ messageToDisplay }) => (
  <View style={Styles.container}>
    <Text>{messageToDisplay}</Text>
    <ActivityIndicator size="large" color={Color.primaryColorNormal} style={Styles.activityIndicator} />
  </View>
);

LoadingInProgress.propTypes = {
  messageToDisplay: PropTypes.string,
};

LoadingInProgress.defaultProps = {
  messageToDisplay: '',
};

export default LoadingInProgress;
