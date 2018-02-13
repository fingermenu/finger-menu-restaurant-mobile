// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import Styles from './Styles';

class Number extends Component {
  onNumberPressed = () => {
    const { item: { id }, onNumberPressed } = this.props;

    onNumberPressed(id);
  };

  render = () => {
    const { item: { name, isSelected }, numberHeight, supportHighlight } = this.props;

    return (
      <View style={Styles.numberContainer}>
        <Avatar
          width={supportHighlight && isSelected ? numberHeight : numberHeight - 10}
          height={supportHighlight && isSelected ? numberHeight : numberHeight - 10}
          rounded
          title={name}
          onPress={this.onNumberPressed}
          activeOpacity={0.6}
          opacity={0.5}
          overlayContainerStyle={supportHighlight && isSelected ? Styles.selectedNumberContainer : Styles.defaultNumberContainer}
        />
      </View>
    );
  };
}

Number.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
  }).isRequired,
  numberHeight: PropTypes.number.isRequired,
  supportHighlight: PropTypes.bool.isRequired,
  onNumberPressed: PropTypes.func.isRequired,
};

export default Number;
