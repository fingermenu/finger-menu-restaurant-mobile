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
    return Range(0, this.props.maxNumber).map(function(num) {
      return { id: num, name: num.toString(), isSelected: num === initValue };
    });
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
    this.updateIndex(number);
    this.props.onNumberPressed(number);
  };

  renderNumber = item => {
    return (
      <View style={Styles.numberContainer}>
        <Avatar
          width={item.item.isSelected ? 50 : 40}
          height={item.item.isSelected ? 50 : 40}
          rounded
          title={item.item.name}
          onPress={() => this.onNumberPressed(item.item.id)}
          activeOpacity={0.7}
          overlayContainerStyle={item.item.isSelected ? Styles.selectedNumberContainer : {}}
        />
      </View>
    );
  };

  render = () => {
    // this.updateIndex(this.props.initialValue);
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
  onNumberPressed: PropTypes.func.isRequired,
  onOkPressed: PropTypes.func.isRequired,
  onClearPressed: PropTypes.func.isRequired,
};

NumberPad.defaultProps = {
  numColumns: 3,
  maxNumber: 10,
  isHorizontal: false,
  initialValue: 0,
};

export default NumberPad;
