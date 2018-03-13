// @flow

import React, { Component } from 'react';
import { View } from 'react-native';
import { Input as ExistingTextInput } from 'react-native-elements';

export default class TextInput extends Component {
  onBlur = event => this.props.input.onBlur(event.nativeEvent.text);

  render = () => {
    const { input, ...rest } = this.props;

    return (
      <View>
        <ExistingTextInput {...rest} onBlur={this.onBlur} onChangeText={input.onChange} onFocus={input.onFocus} value={input.value} />
      </View>
    );
  };
}
