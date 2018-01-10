// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { TouchableItem } from '@microbusiness/common-react-native';
import Styles from './Styles';

class PlaceOrderControlView extends Component {
  render = () => {
    return (
      <TouchableItem onPress={this.props.placeOrderPressed} style={Styles.container}>
        <View style={Styles.textContainer}>
          <Text style={Styles.text}>PLACE ORDER</Text>
          <Text style={Styles.text}> {this.props.totalOrderQuantity}</Text>
        </View>
      </TouchableItem>
    );
  };
}

PlaceOrderControlView.propTypes = {
  placeOrderPressed: PropTypes.func.isRequired,
  totalOrderQuantity: PropTypes.number.isRequired,
};

export default PlaceOrderControlView;
