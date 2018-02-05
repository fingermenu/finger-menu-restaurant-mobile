// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import { DefaultColor, DefaultStyles } from '../../style';
import { Avatar } from 'react-native-elements';
import { ImageUtility } from '../image';
import Styles from './Styles';

class HeaderView extends Component {
  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.bannerContainer}>
          <Text>43 Degrees</Text>
        </View>
        <View style={[DefaultStyles.rowContainer, Styles.languageContainer]}>
          <TouchableItem
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            pressColor={DefaultColor.touchableIconPressColor}
            onPress={() => this.props.changeLanguage('en_NZ')}
            borderless
          >
            <View style={Styles.touchableContainer}>
              <Avatar
                rounded
                overlayContainerStyle={this.props.isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
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
            onPress={() => this.props.changeLanguage('zh')}
            borderless
          >
            <View style={Styles.touchableContainer}>
              <Avatar
                rounded
                overlayContainerStyle={this.props.isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
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
            onPress={() => this.props.changeLanguage('jp')}
            borderless
          >
            <View style={Styles.touchableContainer}>
              <Avatar
                rounded
                overlayContainerStyle={this.props.isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
                source={ImageUtility.getImageSource('japanese')}
                activeOpacity={0.7}
              />
            </View>
          </TouchableItem>
        </View>
      </View>
    );
  };
}

HeaderView.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
};

export default HeaderView;
