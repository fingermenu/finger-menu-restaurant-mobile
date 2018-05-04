// @flow

import { Map, Range } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import int from 'int';
import Styles from './Styles';
import Number from './Number';

// TODO: Consider replace it with redux form.
class NumberPad extends Component {
  constructor(props, context) {
    super(props, context);

    let numbers = Range(0, props.maxNumber).reduce(
      (reduction, idx) => reduction.set(idx.toString(), Map({ id: idx, name: idx.toString(), isSelected: idx === props.initialValue })),
      Map(),
    );

    if (props.supportReset && props.maxNumber === 10) {
      numbers = numbers.set('-1', Map({ id: -1, name: ' ', isSelected: false })).set('-2', Map({ id: -2, name: ' ', isSelected: false }));
    }

    this.state = {
      numbers,
    };
  }

  onNumberPressed = id => {
    if (id < 0) {
      return;
    }

    this.updateIndex(id);
    this.props.onNumberPressed(id);
  };

  updateIndex = id => {
    this.setState({ numbers: this.state.numbers.map(_ => _.set('isSelected', false)).setIn([id.toString(), 'isSelected'], true) });
  };

  keyExtractor = item => item.get('id').toString();

  renderNumber = item => (
    <Number
      item={item.item.toJS()}
      numberHeight={this.props.numberHeight}
      supportHighlight={this.props.supportHighlight}
      onNumberPressed={this.onNumberPressed}
    />
  );

  render = () => {
    const { isHorizontal, numColumns, supportReset, maxNumber } = this.props;
    let numbers;

    if (supportReset && maxNumber === 10) {
      const number0 = this.state.numbers.get('0');
      const button0 = this.state.numbers.get('-1');
      const button1 = this.state.numbers.get('-2');

      numbers = this.state.numbers
        .filterNot(val => val.get('id') === number0.get('id') || val.get('id') === button0.get('id') || val.get('id') === button1.get('id'))
        .sort((val1, val2) => int(val1.get('id')).cmp(val2.get('id')))
        .toList()
        .push(button0)
        .push(number0)
        .push(button1)
        .toArray();
    } else {
      numbers = this.state.numbers
        .sort((val1, val2) => int(val1.get('id')).cmp(val2.get('id')))
        .valueSeq()
        .toArray();
    }

    return (
      <View style={Styles.container}>
        {isHorizontal ? (
          <FlatList data={numbers} numColumns={10} renderItem={this.renderNumber} keyExtractor={this.keyExtractor} />
        ) : (
          <FlatList data={numbers} numColumns={numColumns} renderItem={this.renderNumber} keyExtractor={this.keyExtractor} />
        )}
      </View>
    );
  };
}

NumberPad.propTypes = {
  numColumns: PropTypes.number,
  isHorizontal: PropTypes.bool,
  supportHighlight: PropTypes.bool,
  supportReset: PropTypes.bool,
  onNumberPressed: PropTypes.func.isRequired,
  numberHeight: PropTypes.number,
  maxNumber: PropTypes.number,
  initialValue: PropTypes.number,
};

NumberPad.defaultProps = {
  numColumns: 3,
  isHorizontal: false,
  supportHighlight: true,
  supportReset: false,
  numberHeight: 50,
  initialValue: 0,
  maxNumber: 10,
};

export default NumberPad;
