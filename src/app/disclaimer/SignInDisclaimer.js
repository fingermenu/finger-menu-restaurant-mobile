// @flow

import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import Disclaimer from './Disclaimer';
import Styles from './Styles';

const SignInDisclaimer = ({ disclaimerButtonClicked }) => (
  <View style={Styles.container}>
    <Disclaimer />
    <Button backgroundColor="#649A59" raised title="OK" onPress={() => disclaimerButtonClicked()} />
  </View>
);

SignInDisclaimer.propTypes = {
  disclaimerButtonClicked: PropTypes.func.isRequired,
};

export default SignInDisclaimer;
