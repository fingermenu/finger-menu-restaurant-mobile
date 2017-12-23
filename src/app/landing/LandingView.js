// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { View, ImageBackground, Text } from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
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
        <TouchableItem onPress={() => this.props.navigateToMenu(1)}>
          <View style={Styles.overlay}>
            <Text style={Styles.header}>{landing.headerText}</Text>
            <Text>{landing.introText}</Text>
            <Text style={Styles.button}>{landing.buttonText}</Text>
          </View>
        </TouchableItem>
      </ImageBackground>
    );
  };

  renderLandingPages = landings => {
    return landings.map(_ => {
      return this.renderLandingPage(_);
    });
  };

  render = () => {
    return (
      <Swiper showsButtons={true} scrollEnable={false}>
        {this.renderLandingPages(this.props.landings)}
      </Swiper>
    );
  };
}

LandingView.propTypes = {
  landings: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      headerText: PropTypes.string,
      introText: PropTypes.string,
      buttonText: PropTypes.string,
    }),
  ).isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

export default LandingView;
