// @flow

import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

export default class FormTextInput extends Component {
  render = () => {
    const { input, ...rest } = this.props;

    return (
      <View>
        <TextInput {...rest} onBlur={this.onBlur} onChangeText={input.onChange} onFocus={input.onFocus} value={input.value} />
      </View>
    );
  };

  onBlur = event => this.props.input.onBlur(event.nativeEvent.text);
}
