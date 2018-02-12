// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { View, ImageBackground, Text } from 'react-native';
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
        <TouchableItem onPress={this.props.navigateToMenu}>
          <View style={Styles.overlay}>
            <Text style={Styles.welcomeText}>{this.props.welcomeText}</Text>
            <Text style={Styles.restaurantName}>{this.props.restaurantName}</Text>
            <Text style={Styles.subTitle}>{this.props.restaurantSubTitle}</Text>
            <Text style={Styles.openingHour}>{this.props.openingHourText}</Text>
            <Text style={Styles.button}>Enter</Text>
          </View>
        </TouchableItem>
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
  backgroundImageUrl: PropTypes.string.isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

export default LandingView;
