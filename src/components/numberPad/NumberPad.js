// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import Immutable, { Range } from 'immutable';
import Styles from './Styles';

// TODO: Consider replace it with redux form.
class NumberPad extends Component {
  constructor() {
    super();
    this.state = {
      numbers: [],
    };
  }

  componentWillMount = () => {
    this.setState({ numbers: this.getNumArrayList().toJS() });
  };

  getNumArrayList = () => {
    const initValue = this.props.initialValue;
    let numArray = Range(0, this.props.maxNumber)
      .map(function(num) {
        return { id: num, name: num.toString(), isSelected: num === initValue };
      })
      .toList();

    if (this.props.supportReset && this.props.maxNumber === 10) {
      numArray = numArray.insert(9, { id: -1, name: ' ' });
      numArray = numArray.insert(11, { id: -2, name: ' ' });
    }

    return numArray;
  };

  updateIndex = selectedIndex => {
    let numList = Immutable.fromJS(this.state.numbers);

    const prevSelected = numList.findIndex(num => num.get('isSelected') === true);

    if (prevSelected >= 0) {
      numList = numList.updateIn([prevSelected, 'isSelected'], function() {
        return false;
      });
    }

    numList = numList.updateIn([selectedIndex, 'isSelected'], function() {
      return true;
    });

    this.setState({ numbers: numList.toJS() });
  };

  onNumberPressed = number => {
    if (number < 0) {
      return;
    }

    this.updateIndex(number);
    this.props.onNumberPressed(number);
  };

  renderNumber = item => {
    return (
      <View style={Styles.numberContainer}>
        <Avatar
          width={this.props.supportHighlight && item.item.isSelected ? this.props.numberHeight : this.props.numberHeight - 10}
          height={this.props.supportHighlight && item.item.isSelected ? this.props.numberHeight : this.props.numberHeight - 10}
          rounded
          title={item.item.name}
          onPress={() => this.onNumberPressed(item.item.id)}
          activeOpacity={0.6}
          opacity={0.5}
          overlayContainerStyle={this.props.supportHighlight && item.item.isSelected ? Styles.selectedNumberContainer : Styles.defaultNumberContainer}
        />
      </View>
    );
  };

  render = () => {
    return (
      <View style={Styles.container}>
        {this.props.isHorizontal ? (
          <FlatList data={this.state.numbers} horizontal={this.props.isHorizontal} renderItem={this.renderNumber} keyExtractor={item => item.id} />
        ) : (
          <FlatList data={this.state.numbers} numColumns={this.props.numColumns} renderItem={this.renderNumber} keyExtractor={item => item.id} />
        )}
      </View>
    );
  };
}

NumberPad.propTypes = {
  numColumns: PropTypes.number,
  maxNumber: PropTypes.number,
  isHorizontal: PropTypes.bool,
  initialValue: PropTypes.number,
  supportHighlight: PropTypes.bool,
  supportReset: PropTypes.bool,
  onNumberPressed: PropTypes.func.isRequired,
  numberHeight: PropTypes.number,
};

NumberPad.defaultProps = {
  numColumns: 3,
  maxNumber: 10,
  isHorizontal: false,
  initialValue: 0,
  supportHighlight: true,
  supportReset: false,
  numberHeight: 50,
};

export default NumberPad;
