// @flow

import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import ImageZoom from 'react-native-image-pan-zoom';
import Styles from './Styles';

class FlyerDetail extends Component {
  renderSlide = slide => {
    return (
      <View style={Styles.slide1}>
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Dimensions.get('window').width + 100}
          imageHeight={Dimensions.get('window').height}
        >
          <Image
            style={{ width: Dimensions.get('window').width + 150, height: Dimensions.get('window').height }}
            source={{
              uri: slide.uri,
            }}
          />
        </ImageZoom>
      </View>
    );
  };

  renderSlides = slides => {
    return slides.map(_ => {
      return this.renderSlide(_);
    });
  };

  render = () => {
    return (
      <Swiper style={Styles.wrapper} showsButtons={true} scrollEnable={false}>
        {this.renderSlides(this.props.slides)}
      </Swiper>
    );
  };
}

export default FlyerDetail;
