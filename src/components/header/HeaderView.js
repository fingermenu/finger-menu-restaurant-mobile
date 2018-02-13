// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground } from 'react-native';
import { DefaultStyles } from '../../style';
import Styles from './Styles';
import LangaugeSelector from './LangaugeSelector';
import i18n from '../../i18n';

const HeaderView = ({ changeLanguage }) => (
  <ImageBackground
    style={Styles.container}
    source={{
      uri:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Ftop.jpg?alt=media&token=1df03e7d-16f0-44a7-998a-9be610d2fd0d',
    }}
  >
    <View style={Styles.bannerContainer}>{/*<Text>43 Degrees</Text>*/}</View>
    <View style={[DefaultStyles.rowContainer, Styles.languageContainer]}>
      <LangaugeSelector isSelected={i18n.language.localeCompare('en_NZ') === 0} language="en_NZ" changeLanguage={changeLanguage} />
      <LangaugeSelector isSelected={i18n.language.localeCompare('jp') === 0} language="zh" changeLanguage={changeLanguage} />
      <LangaugeSelector isSelected={i18n.language.localeCompare('jp') === 0} language="jp" changeLanguage={changeLanguage} />
      <LangaugeSelector isSelected={i18n.language.localeCompare('ko') === 0} language="ko" changeLanguage={changeLanguage} />
    </View>
  </ImageBackground>
);

HeaderView.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
};

export default HeaderView;
