// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { MenuOption } from 'react-native-popup-menu';
import { ImageUtility } from '../image';
import Styles from './Styles';

class LanguageSelector extends Component {
  changeLanguage = () => {
    this.props.changeLanguage(this.props.language);
  };

  render = () => {
    const { isSelected, language } = this.props;

    return (
      <MenuOption onSelect={this.changeLanguage}>
        <View style={[Styles.menuOptionContainer, isSelected ? Styles.selectedIconContainer : Styles.iconContainer]}>
          <Avatar
            rounded
            overlayContainerStyle={isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
            source={ImageUtility.getImageSource(language)}
            activeOpacity={0.7}
          />
          <View style={Styles.iconTextContainer}>
            <Text style={isSelected ? Styles.selectedIconText : Styles.IconText}>{language}</Text>
          </View>
        </View>
      </MenuOption>
    );
  };
}

LanguageSelector.propTypes = {
  language: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default LanguageSelector;
