// @flow

import React, { Component } from 'react';
import { CheckBox, Text } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles, { DefaultColors } from './Styles';

class RadioButton extends Component {
  onChange = () => this.props.onChange(this.props.id);

  render = () => {
    const { checked, checkedColor, label, ...rest } = this.props;

    return (
      <View style={Styles.radioContainer}>
        <View>
          <CheckBox
            {...rest}
            checked={checked}
            onIconPress={this.onChange}
            containerStyle={Styles.radio}
            size={36}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor={checkedColor}
          />
        </View>
        <View>
          <Text style={Styles.optionName}>{label}</Text>
        </View>
      </View>
    );
  };
}

RadioButton.propTypes = {
  checkedColor: PropTypes.string,
};

RadioButton.defaultProps = {
  checkedColor: DefaultColors.defaultThemeColor,
};

export default RadioButton;
