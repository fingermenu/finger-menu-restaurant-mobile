// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Avatar, Button } from 'react-native-elements';

class NumberPad extends Component {
  renderNumber = item => {
    return (
      <View>
        <Avatar small rounded title={item.item.name} onPress={() => this.props.onNumberPressed(item)} activeOpacity={0.7} />
      </View>
    );
  };

  render = () => {
    const numberArray = Array.from(Array(10).keys()).map(function(num) {
      return { id: num, name: num.toString() };
    });

    return (
      <View>
        <FlatList numColumns={3} data={numberArray} renderItem={this.renderNumber} keyExtractor={item => item.id} />
        <Button title="Ok" />
      </View>
    );
  };
}

NumberPad.propTypes = {
  onNumberPressed: PropTypes.func.isRequired,
  onOkPressed: PropTypes.func.isRequired,
  onClearPressed: PropTypes.func.isRequired,
};

export default NumberPad;
