// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import RadioButton from './RadioButton';

class RadioButtonGroup extends Component {
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
      ids,
      renderItem,
      input: { value },
      containerStyle,
      ...rest
    } = this.props;

    return (
      <View style={containerStyle}>
        {ids.map(id => <RadioButton key={id} onChange={this.handleChange} checked={value[id]} id={id} renderItem={renderItem} {...rest} />)}
      </View>
    );
  };
}

RadioButtonGroup.propTypes = {
  renderItem: PropTypes.func.isRequired,
  ids: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default RadioButtonGroup;
