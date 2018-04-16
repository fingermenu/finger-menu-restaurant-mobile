// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { View } from 'react-native';
import RadioButton from './RadioButton';

class RadioSet extends Component {
  handleChange = id => {
    const {
      input: { value, onChange },
    } = this.props;

    onChange(
      Immutable.fromJS(value)
        .mapEntries(([key]) => [key, false])
        .set(id, true)
        .toJS(),
    );
  };

  render = () => {
    const {
      radios,
      input: { value },
      containerStyle,
      ...rest
    } = this.props;

    return (
      <View style={containerStyle}>
        {radios.map(radio => (
          <RadioButton key={radio.id} onChange={this.handleChange} checked={value[radio.id]} label={radio.label} id={radio.id} {...rest} />
        ))}
      </View>
    );
  };
}

export default RadioSet;
