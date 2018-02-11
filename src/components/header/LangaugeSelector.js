// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import { DefaultColor } from '../../style';
import { Avatar } from 'react-native-elements';
import { ImageUtility } from '../image';
import Styles from './Styles';

class LanguageSelector extends Component {
  render = () => {
    const { isSelected, language } = this.props;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityTraits="button"
        delayPressIn={0}
        pressColor={DefaultColor.touchableIconPressColor}
        onPress={this.changeLanguage}
        borderless
      >
        <View style={Styles.touchableContainer}>
          <Avatar
            rounded
            overlayContainerStyle={isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
            source={ImageUtility.getImageSource(language)}
            activeOpacity={0.7}
          />
        </View>
      </TouchableItem>
    );
  };

  changeLanguage = () => {
    this.props.changeLanguage(this.props.language);
  };
}

LanguageSelector.propTypes = {
  language: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default LanguageSelector;
