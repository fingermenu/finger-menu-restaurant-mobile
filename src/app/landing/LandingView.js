// @flow

import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import Styles from './Styles';

class LandingView extends Component {
  renderLandingPage = () => {
    return (
      <ImageBackground
        style={Styles.backgroundImage}
        source={{
          uri: this.props.backgroundImageUrl,
        }}
      >
        <View style={Styles.buttonContainer}>
          <Button title="Start Order" buttonStyle={Styles.button} onPress={this.props.navigateToMenu} />
        </View>
      </ImageBackground>
    );
  };

  render = () => {
    return this.renderLandingPage(this.props.landing);
  };
}

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

export default LandingView;
