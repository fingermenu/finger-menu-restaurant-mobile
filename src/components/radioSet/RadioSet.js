// @flow

import React, { Component } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { View } from 'react-native';
import RadioButton from './RadioButton';

class RadioSet extends Component {
  render() {
    const {
      radios,
      input: { value, onChange },
      containerStyle,
      ...rest
    } = this.props;
    return (
      <View style={containerStyle}>
        {radios.map(radio => (
          <RadioButton key={radio.value} onChange={onChange} checked={radio.value === value} {...rest} label={radio.label} value={radio.value} />
        ))}
      </View>
    );
  }
}

export default RadioSet;
