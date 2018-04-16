// @flow

import React, { Component } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { CheckBox, Text } from 'react-native-elements'; // eslint-disable-line import/no-extraneous-dependencies
import { View } from 'react-native';
import PropTypes from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies
import Styles, { DefaultColors } from './Styles';

class RadioButton extends Component {
  onChange = () => this.props.onChange(this.props.value);

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
