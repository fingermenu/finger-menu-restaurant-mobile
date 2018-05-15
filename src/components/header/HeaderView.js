// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { TouchableIcon } from '@microbusiness/common-react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Styles from './Styles';
import { LangaugeSelectorMenuOption } from '../languageSelector';
import { ActiveCustomersMenuOption } from '../customers';
import i18n from '../../i18n';
import { ImageUtility } from '../image';
import { DefaultColor, DefaultStyles } from '../../style';
import { CustomerProp } from '../../framework/applicationState';

const HeaderView = ({ onLanguageChanged, backgroundImageUrl, onActiveCustomerChanged, customers, activeCustomerId, onEditCustomerNamePressed }) => (
  <ImageBackground style={Styles.container} source={{ uri: backgroundImageUrl }} resizeMode="stretch">
    <View />
    {customers.length > 0 && (
      <View style={DefaultStyles.rowContainer}>
        <Menu>
          <MenuTrigger>
            <View style={DefaultStyles.rowContainer}>
              <Icon name="person-outline" color="white" />
              <Text style={[DefaultStyles.primaryLabelFont, Styles.guestName]}>
                {customers.find(customer => customer.customerId === activeCustomerId).name}
              </Text>
            </View>
          </MenuTrigger>
          <MenuOptions>
            {customers.map(customer => (
              <ActiveCustomersMenuOption
                key={customer.customerId}
                isSelected={customer.customerId === activeCustomerId}
                name={customer.name}
                customerId={customer.customerId}
                onActiveCustomerChanged={onActiveCustomerChanged}
              />
            ))}
          </MenuOptions>
        </Menu>
        <TouchableIcon
          onPress={onEditCustomerNamePressed}
          iconName="account-edit"
          iconType="material-community"
          iconColor={DefaultColor.iconColor}
          pressColor={DefaultColor.touchableIconPressColor}
          iconDisabledColor={DefaultColor.defaultFontColorDisabled}
          iconContainerStyle={DefaultStyles.iconContainerStyle}
        />
      </View>
    )}
    <Menu>
      <MenuTrigger>
        <FastImage style={Styles.image} source={ImageUtility.getImageSource('languageSelector')} resizeMode={FastImage.resizeMode.contain} />
      </MenuTrigger>
      <MenuOptions>
        <LangaugeSelectorMenuOption isSelected={i18n.language.localeCompare('en_NZ') === 0} language="en_NZ" onLanguageChanged={onLanguageChanged} />
        <LangaugeSelectorMenuOption isSelected={i18n.language.localeCompare('zh') === 0} language="zh" onLanguageChanged={onLanguageChanged} />
        <LangaugeSelectorMenuOption isSelected={i18n.language.localeCompare('jp') === 0} language="jp" onLanguageChanged={onLanguageChanged} />
      </MenuOptions>
    </Menu>
  </ImageBackground>
);

HeaderView.propTypes = {
  onLanguageChanged: PropTypes.func.isRequired,
  onActiveCustomerChanged: PropTypes.func.isRequired,
  onEditCustomerNamePressed: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(CustomerProp).isRequired,
  activeCustomerId: PropTypes.string,
};

HeaderView.defaultProps = {
  activeCustomerId: null,
};

export default HeaderView;
