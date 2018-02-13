// @flow

import React, { Component } from 'react';
import { CheckBox as ExistingCheckBox } from 'react-native-elements';
import { DefaultColor } from '../../style/DefaultStyles';
import Styles from './Styles';

export default class CheckBox extends Component {
  onChange = () => this.props.input.onChange(!this.props.input.value);

  render = () => {
    const { input, ...rest } = this.props;

    return (
      <ExistingCheckBox
        {...rest}
        checked={!!input.value}
        onIconPress={this.onChange}
        containerStyle={Styles.checkbox}
        size={36}
        iconType="MaterialIcons"
        checkedIcon="check-box"
        uncheckedIcon="check-box-outline-blank"
        checkedColor={DefaultColor.defaultThemeColor}
      />
    );
  };
}
