// @flow

import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Styles from './Styles';

const LandingView = ({ t, backgroundImageUrl, navigateToMenu }) => (
  <ImageBackground style={Styles.backgroundImage} source={{ uri: backgroundImageUrl }} resizeMode="stretch">
    <View style={Styles.buttonContainer}>
      <Button title={t('startOrder.button')} buttonStyle={Styles.button} onPress={navigateToMenu} />
    </View>
  </ImageBackground>
);

LandingView.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  restaurantSubTitle: PropTypes.string.isRequired,
  welcomeText: PropTypes.string.isRequired,
  openingHourText: PropTypes.string.isRequired,
  backgroundImageUrl: PropTypes.string,
  navigateToMenu: PropTypes.func.isRequired,
};

LandingView.defaultProps = {
  backgroundImageUrl: null,
};

export default translate()(LandingView);
