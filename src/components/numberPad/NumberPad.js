// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import Immutable, { Range } from 'immutable';
import Styles from './Styles';
import Number from './Number';

// TODO: Consider replace it with redux form.
class NumberPad extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      numbers: NumberPad.getNumArrayList(props).toJS(),
    };
  }

  render = () => {
    const { isHorizontal, numColumns } = this.props;
    const { numbers } = this.state;

    return (
      <View style={Styles.container}>
        {isHorizontal ? (
          <FlatList data={numbers} horizontal renderItem={this.renderNumber} keyExtractor={this.keyExtractor} />
        ) : (
          <FlatList data={numbers} numColumns={numColumns} renderItem={this.renderNumber} keyExtractor={this.keyExtractor} />
        )}
      </View>
    );
  };

  keyExtractor = item => item.id;

  updateIndex = selectedIndex => {
    let numList = Immutable.fromJS(this.state.numbers);
    const prevSelected = numList.findIndex(num => num.get('isSelected') === true);

    if (prevSelected >= 0) {
      numList = numList.setIn([prevSelected, 'isSelected'], false);
    }

    numList = numList.setIn([selectedIndex, 'isSelected'], true);

    this.setState({ numbers: numList.toJS() });
  };

  onNumberPressed = number => {
    if (number < 0) {
      return;
    }

    this.updateIndex(number);
    this.props.onNumberPressed(number);
  };

  renderNumber = item => (
    <Number
      item={item.item}
      numberHeight={this.props.numberHeight}
      supportHighlight={this.props.supportHighlight}
      onNumberPresse={this.onNumberPressed}
    />
  );

  static getNumArrayList = ({ initialValue, maxNumber, supportReset }) => {
    const initValue = initialValue;

    let numArray = Range(0, maxNumber)
      .map(num => ({ id: num, name: num.toString(), isSelected: num === initValue }))
      .toList();

    if (supportReset && maxNumber === 10) {
      numArray = numArray.insert(9, { id: -1, name: ' ' });
      numArray = numArray.insert(11, { id: -2, name: ' ' });
    }

    return numArray;
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
