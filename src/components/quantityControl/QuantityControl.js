// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { TouchableIcon } from '@microbusiness/common-react-native';
import { DefaultStyles } from '../../style/DefaultStyles';
import Styles from './Styles';
import { DefaultColor } from '../../style';

const QuantityControl = ({ onQuantityIncrease, onQuantityDecrease, quantity }) => (
  <View style={[DefaultStyles.rowContainer, Styles.container]}>
    <TouchableIcon
      iconName="plus"
      iconContainerStyle={DefaultStyles.iconContainerStyle}
      iconType="material-community"
      onPress={onQuantityIncrease}
      pressColor={DefaultColor.touchableIconPressColor}
      iconColor={DefaultColor.iconColor}
      iconDisabledColor={DefaultColor.defaultFontColorDisabled}
    />
    <Text style={DefaultStyles.primaryFont}>{quantity}</Text>
    <TouchableIcon
      iconName="minus"
      iconContainerStyle={DefaultStyles.iconContainerStyle}
      iconType="material-community"
      onPress={onQuantityDecrease}
      pressColor={DefaultColor.touchableIconPressColor}
      iconColor={DefaultColor.iconColor}
      iconDisabledColor={DefaultColor.defaultFontColorDisabled}
    />
  </View>
);

QuantityControl.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityIncrease: PropTypes.func.isRequired,
  onQuantityDecrease: PropTypes.func.isRequired,
};

export default QuantityControl;
