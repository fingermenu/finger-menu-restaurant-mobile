// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import { DefaultColor } from '../../style';
import { Avatar } from 'react-native-elements';
import { ImageUtility } from '../image';
import Styles from './Styles';

class HeaderView extends Component {
  render = () => {
    return (
      <View>
        <View style={Styles.container}>
          <View>
            <Text>43 Degrees</Text>
          </View>
          <View style={Styles.container}>
            <TouchableItem
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              pressColor={DefaultColor.touchableIconPressColor}
              onPress={() => this.props.changeLanguage('en')}
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
          </View>
        </View>
      </View>
    );
  };
}

HeaderView.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
};

export default HeaderView;
