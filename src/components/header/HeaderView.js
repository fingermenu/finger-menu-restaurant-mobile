// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import { DefaultColor, DefaultStyles } from '../../style';
import { Avatar } from 'react-native-elements';
import { ImageUtility } from '../image';
import Styles from './Styles';

class HeaderView extends Component {
  render = () => {
    const { isSelected } = this.props;

    return (
      <ImageBackground
        style={Styles.container}
        source={{
          uri:
            'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Ftop.jpg?alt=media&token=1df03e7d-16f0-44a7-998a-9be610d2fd0d',
        }}
      >
        <View style={Styles.bannerContainer}>{/*<Text>43 Degrees</Text>*/}</View>
        <View style={[DefaultStyles.rowContainer, Styles.languageContainer]}>
          <TouchableItem
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            pressColor={DefaultColor.touchableIconPressColor}
            onPress={this.changeLanguageToENNZ}
            borderless
          >
            <View style={Styles.touchableContainer}>
              <Avatar
                rounded
                overlayContainerStyle={isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
                source={ImageUtility.getImageSource('english')}
                activeOpacity={0.7}
              />
            </View>
          </TouchableItem>
          <TouchableItem
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            pressColor={DefaultColor.touchableIconPressColor}
            onPress={this.changeLanguageToZH}
            borderless
          >
            <View style={Styles.touchableContainer}>
              <Avatar
                rounded
                overlayContainerStyle={isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
                source={ImageUtility.getImageSource('chinese')}
                activeOpacity={0.7}
              />
            </View>
          </TouchableItem>
          <TouchableItem
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            pressColor={DefaultColor.touchableIconPressColor}
            onPress={this.changeLanguageToJP}
            borderless
          >
            <View style={Styles.touchableContainer}>
              <Avatar
                rounded
                overlayContainerStyle={isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
                source={ImageUtility.getImageSource('japanese')}
                activeOpacity={0.7}
              />
            </View>
          </TouchableItem>
        </View>
      </ImageBackground>
    );
  };

  changeLanguageToENNZ = () => {
    this.props.changeLanguage('en_NZ');
  };

  changeLanguageToZH = () => {
    this.props.changeLanguage('zh');
  };

  changeLanguageToJP = () => {
    this.props.changeLanguage('jp');
  };
}

HeaderView.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default HeaderView;
