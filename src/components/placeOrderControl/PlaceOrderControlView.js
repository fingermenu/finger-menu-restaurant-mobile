// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';

const PlaceOrderControlView = ({ placeOrderPressed, totalOrderQuantity }) => (
  <TouchableItem onPress={placeOrderPressed} style={Styles.container}>
    <View style={Styles.textContainer}>
      <Text style={Styles.text}>View Order</Text>
      <Text style={Styles.text}> {totalOrderQuantity} Items</Text>
    </View>
  </TouchableItem>
);

PlaceOrderControlView.propTypes = {
  placeOrderPressed: PropTypes.func.isRequired,
  totalOrderQuantity: PropTypes.number.isRequired,
};

export default PlaceOrderControlView;
