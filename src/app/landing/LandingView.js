// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { View, ImageBackground, Text } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';

class LandingView extends Component {
  renderLandingPage = landing => {
    return (
      <ImageBackground
        style={Styles.backgroundImage}
        source={{
          uri: landing.uri,
        }}
      >
        <TouchableItem onPress={this.props.navigateToMenu}>
          <View style={Styles.overlay}>
            <Text style={Styles.header}>{landing.headerText}</Text>
            <Text>{landing.introText}</Text>
            <Text style={Styles.button}>{landing.buttonText}</Text>
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
  landing: PropTypes.shape({
    uri: PropTypes.string,
    headerText: PropTypes.string,
    introText: PropTypes.string,
    buttonText: PropTypes.string,
  }).isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

export default LandingView;
