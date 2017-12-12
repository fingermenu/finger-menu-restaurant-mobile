// @flow

import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import PricingDisclaimer from './PricingDisclaimer';
import Styles from './Styles';

const SignInPricingDisclaimer = ({ disclaimerButtonClicked }) => (
  <View style={Styles.container}>
    <PricingDisclaimer />
    <Button backgroundColor="#649A59" raised title="OK" onPress={() => disclaimerButtonClicked()} />
  </View>
);

SignInPricingDisclaimer.propTypes = {
  disclaimerButtonClicked: PropTypes.func.isRequired,
};

export default SignInPricingDisclaimer;
