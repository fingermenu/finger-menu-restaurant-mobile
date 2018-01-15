// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Range } from 'immutable';
import Styles from './Styles';
import { DefaultColor } from '../../style';

class NumberPad extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
  }
  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  onNumberPressed = item => {
    this.updateIndex(item);
    this.props.onNumberPressed(item);
  };

  renderNumber = item => {
    return (
      <View style={Styles.numberContainer}>
        <Avatar
          small
          rounded
          title={item.item.name}
          onPress={() => this.onNumberPressed(item)}
          activeOpacity={0.7}
          overlayContainerStyle={item.item.isSelected ? { backgroundColor: DefaultColor.defaultBannerColor } : {}}
        />
      </View>
    );
  };

  render = () => {
    const numberArray = Range(0, 10)
      .map(function(num) {
        return { id: num, name: num.toString(), isSelected: false };
      })
      .toJS();
    numberArray[0].isSelected = true;
    return (
      <View>
        <FlatList data={numberArray} numColumns={this.props.numColumns} renderItem={this.renderNumber} keyExtractor={item => item.id} />
      </View>
    );
  };
}

NumberPad.propTypes = {
  numColumns: PropTypes.number,
  onNumberPressed: PropTypes.func.isRequired,
  onOkPressed: PropTypes.func.isRequired,
  onClearPressed: PropTypes.func.isRequired,
};

NumberPad.defaultProps = {
  numColumns: 3,
};

export default NumberPad;
