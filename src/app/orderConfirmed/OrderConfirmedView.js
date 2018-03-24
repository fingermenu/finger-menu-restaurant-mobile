// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View } from 'react-native';
import { translate } from 'react-i18next';
import Config from '../../framework/config';
import Styles from './Styles';

const OrderConfirmedView = ({ t, restaurantLogoImageUrl, onFingerMenuPressed }) => {
  return (
    <View style={Styles.container}>
      {restaurantLogoImageUrl ? <Image style={Styles.topLogo} source={{ uri: restaurantLogoImageUrl }} /> : <View />}
      <Text style={Styles.text}>{t('thankYouForPlacingOrder.message')}</Text>
      <TouchableItem onPress={onFingerMenuPressed}>
        <Image style={Styles.image} source={{ uri: Config.fingerMenuLogoImageUrl }} />
      </TouchableItem>
    </View>
  );
};

OrderConfirmedView.propTypes = {
  onFingerMenuPressed: PropTypes.func.isRequired,
  restaurantLogoImageUrl: PropTypes.string,
};

OrderConfirmedView.defaultProps = {
  restaurantLogoImageUrl: null,
};

export default translate()(OrderConfirmedView);
