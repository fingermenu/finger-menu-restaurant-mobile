// @flow

import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Styles from './Styles';

const LandingView = ({ t, backgroundImageUrl, onEnterButtonPressed }) => (
  <ImageBackground style={Styles.backgroundImage} source={{ uri: backgroundImageUrl }} resizeMode="stretch">
    <View style={Styles.buttonContainer}>
      <Button title={t('enter.button')} buttonStyle={Styles.button} onPress={onEnterButtonPressed} />
    </View>
  </ImageBackground>
);

LandingView.propTypes = {
  backgroundImageUrl: PropTypes.string,
  onEnterButtonPressed: PropTypes.func.isRequired,
};

LandingView.defaultProps = {
  backgroundImageUrl: null,
};

export default translate()(LandingView);
