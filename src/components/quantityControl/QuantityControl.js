// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { TouchableIcon } from '@microbusiness/common-react-native';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';

class QuantityControl extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.defaultValue,
    };
  }

  getValue = () => {
    const { value } = this.props;

    return value ? value : this.state.value;
  };

  handleValueDecrease = () => {
    this.handleValueChange(this.getValue() - 1);
  };

  handleValueIncrease = () => {
    this.handleValueChange(this.getValue() + 1);
  };

  handleValueChange = newValue => {
    this.setState({ value: newValue });

    const { onChange } = this.props;

    if (onChange) {
      onChange(newValue);
    }
  };

  render = () => (
    <View style={[DefaultStyles.rowContainer, Styles.container]}>
      <TouchableIcon
        iconName="minus"
        iconContainerStyle={DefaultStyles.iconContainerStyle}
        iconType="material-community"
        onPress={this.handleValueDecrease}
        pressColor={DefaultColor.touchableIconPressColor}
        iconColor={DefaultColor.iconColor}
        iconDisabledColor={DefaultColor.defaultFontColorDisabled}
      />
      <Text style={DefaultStyles.primaryFont}>{this.getValue()}</Text>
      <TouchableIcon
        iconName="plus"
        iconContainerStyle={DefaultStyles.iconContainerStyle}
        iconType="material-community"
        onPress={this.handleValueIncrease}
        pressColor={DefaultColor.touchableIconPressColor}
        iconColor={DefaultColor.iconColor}
        iconDisabledColor={DefaultColor.defaultFontColorDisabled}
      />
    </View>
  );
}

QuantityControl.propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.number,
  value: PropTypes.number,
};

QuantityControl.defaultProps = {
  onChange: null,
  defaultValue: 1,
  value: null,
};

export default QuantityControl;
