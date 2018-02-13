// @flow

import React, { Component } from 'react';
import { NumberPad as ExistingNumberPad } from '../numberPad';

export default class NumberPad extends Component {
  onNumberPressed = param => this.props.input.onChange(param);

  render = () => {
    const { input, ...rest } = this.props;

    return <ExistingNumberPad {...rest} initialValue={input.value} onNumberPressed={this.onNumberPressed} />;
  };
}
