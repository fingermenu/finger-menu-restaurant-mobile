// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Styles from './Styles';
import { LangaugeSelectorMenuOption } from '../languageSelector';
import i18n from '../../i18n';
import { ImageUtility } from '../image';

const HeaderView = ({ changeLanguage, backgroundImageUrl }) => (
  <ImageBackground style={Styles.container} source={{ uri: backgroundImageUrl }} resizeMode="stretch">
    <Menu>
      <MenuTrigger>
        <FastImage style={Styles.image} source={ImageUtility.getImageSource('languageSelector')} resizeMode={FastImage.resizeMode.contain} />
      </MenuTrigger>
      <MenuOptions>
        <LangaugeSelectorMenuOption isSelected={i18n.language.localeCompare('en_NZ') === 0} language="en_NZ" changeLanguage={changeLanguage} />
        <LangaugeSelectorMenuOption isSelected={i18n.language.localeCompare('zh') === 0} language="zh" changeLanguage={changeLanguage} />
        <LangaugeSelectorMenuOption isSelected={i18n.language.localeCompare('jp') === 0} language="jp" changeLanguage={changeLanguage} />
      </MenuOptions>
    </Menu>
  </ImageBackground>
);

HeaderView.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
};

export default HeaderView;
