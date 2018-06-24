// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { DefaultColor } from '../../style';
import { ImageUtility } from '../image';
import Styles from './Styles';

class LanguageSelector extends Component {
  changeLanguage = () => {
    const { language, changeLanguage } = this.props;

    changeLanguage(language);
  };

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
}

LanguageSelector.propTypes = {
  language: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default LanguageSelector;
