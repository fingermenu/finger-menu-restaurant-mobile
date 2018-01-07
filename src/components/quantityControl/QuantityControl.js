// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { DefaultStyles } from '../../style/DefaultStyles';
import Styles from './Styles';

class QuantityControl extends Component {
  render = () => {
    return (
      <View style={[DefaultStyles.rowContainer, Styles.container]}>
        <Icon name="plus" type="material-community" />
        <Text>0</Text>
        <Icon name="minus" type="material-community" />
      </View>
    );
  };
}

QuantityControl.propTypes = {
  onQuantityChanged: PropTypes.func.isRequired,
};

export default QuantityControl;
