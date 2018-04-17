// @flow

import React, { Component } from 'react';
import { CheckBox } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';

class RadioButton extends Component {
  handleChange = () => this.props.onChange(this.props.id);

  render = () => {
    const { id, checked, checkedColor, renderItem, ...rest } = this.props;

    return (
      <View style={Styles.radioRowContainer}>
        <View style={Styles.radioContainer}>
          <CheckBox
            {...rest}
            checked={checked}
            onIconPress={this.handleChange}
            containerStyle={Styles.radio}
            size={36}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor={checkedColor}
          />
        </View>
        {renderItem(id)}
      </View>
    );
  };
}

RadioButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  checkedColor: PropTypes.string,
};

RadioButton.defaultProps = {
  checkedColor: '#645953',
};

export default RadioButton;
