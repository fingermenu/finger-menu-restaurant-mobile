// @flow

import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, Button } from 'react-native-elements';

class PinView extends Component {
  onPinPressed = () => {};

  renderPin = item => {
    return (
      <View>
        <Avatar small rounded title={item} onPress={() => this.onPinPressed(item)} activeOpacity={0.7} />
      </View>
    );
  };

  render = () => {
    const pinArray = Array.from(Array(10).keys());

    return (
      <View>
        <FlatList horizontal={true} numColumns={3} data={pinArray} renderItem={this.renderPin} keyExtractor={item => item} />
        <Button title="Ok" />
      </View>
    );
  };
}

export default PinView;
