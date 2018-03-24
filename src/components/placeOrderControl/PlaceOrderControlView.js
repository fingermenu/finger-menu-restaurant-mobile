// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Styles from './Styles';

const PlaceOrderControlView = ({ t, placeOrderPressed, totalOrderQuantity }) => (
  <TouchableItem onPress={placeOrderPressed} style={Styles.container}>
    <View style={Styles.textContainer}>
      <Text style={Styles.text}>{t('viewOrder.label')}</Text>
      <Text style={Styles.text}>{t('numberOfItems.label').replace('{numberOfItems}', totalOrderQuantity)}</Text>
    </View>
  </TouchableItem>
);

PlaceOrderControlView.propTypes = {
  placeOrderPressed: PropTypes.func.isRequired,
  totalOrderQuantity: PropTypes.number.isRequired,
};

export default translate()(PlaceOrderControlView);
