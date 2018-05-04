// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Styles from './Styles';
import { LangaugeSelectorMenuOption } from '../languageSelector';
import { ActiveCustomersMenuOption } from '../customers';
import i18n from '../../i18n';
import { ImageUtility } from '../image';
import { DefaultStyles } from '../../style';
import { ActiveCustomerProp } from '../../framework/applicationState';

const HeaderView = ({ changeLanguage, backgroundImageUrl, changeActiveCustomer, customers, activeCustomerId }) => (
  <ImageBackground style={Styles.container} source={{ uri: backgroundImageUrl }} resizeMode="stretch">
    <View />
    {customers.length > 0 && (
      <Menu>
        <MenuTrigger>
          <View style={DefaultStyles.rowContainer}>
            <Icon name="person-outline" color="white" />
            <Text style={[DefaultStyles.primaryLabelFont, Styles.guestName]}>{customers.find(c => c.id === activeCustomerId).name}</Text>
          </View>
        </MenuTrigger>
        <MenuOptions>
          {customers.map(c => (
            <ActiveCustomersMenuOption
              key={c.id}
              isSelected={c.id === activeCustomerId}
              name={c.name}
              id={c.id}
              changeActiveCustomer={changeActiveCustomer}
            />
          ))}
        </MenuOptions>
      </Menu>
    )}
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
  changeActiveCustomer: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(ActiveCustomerProp).isRequired,
  activeCustomerId: PropTypes.string,
};

HeaderView.defaultProps = {
  activeCustomerId: null,
};

export default HeaderView;
