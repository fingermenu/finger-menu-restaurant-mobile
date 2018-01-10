// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { TouchableIcon } from '@microbusiness/common-react-native';
import { DefaultStyles } from '../../style/DefaultStyles';
import Styles from './Styles';

class QuantityControl extends Component {
  render = () => {
    return (
      <View style={[DefaultStyles.rowContainer, Styles.container]}>
        <TouchableIcon
          iconName="plus"
          iconSize={16}
          iconContainerStyle={Styles.iconContainerStyle}
          iconType="material-community"
          onPress={this.props.onQuantityIncrease}
        />
        <Text>{this.props.quantity}</Text>
        <TouchableIcon
          iconName="minus"
          iconSize={16}
          iconContainerStyle={Styles.iconContainerStyle}
          iconType="material-community"
          onPress={this.props.onQuantityDecrease}
        />
      </View>
    );
  };
}

QuantityControl.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityIncrease: PropTypes.func.isRequired,
  onQuantityDecrease: PropTypes.func.isRequired,
};

export default QuantityControl;
