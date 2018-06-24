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

    const { onNumberPressed } = this.props;

    onNumberPressed(id);
  };

  updateIndex = id => {
    this.setState(({ numbers: prevNumbers }) => ({
      numbers: prevNumbers.map(_ => _.set('isSelected', false)).setIn([id.toString(), 'isSelected'], true),
    }));
  };

  keyExtractor = item => item.get('id').toString();

  renderNumber = item => {
    const { numberHeight, supportHighlight } = this.props;

    return <Number item={item.item.toJS()} numberHeight={numberHeight} supportHighlight={supportHighlight} onNumberPressed={this.onNumberPressed} />;
  };

  render = () => {
    const { isHorizontal, numColumns, supportReset, maxNumber } = this.props;
    const { numbers } = this.state;
    let newNumbers;

    if (supportReset && maxNumber === 10) {
      const number0 = numbers.get('0');
      const button0 = numbers.get('-1');
      const button1 = numbers.get('-2');

      newNumbers = numbers
        .filterNot(val => val.get('id') === number0.get('id') || val.get('id') === button0.get('id') || val.get('id') === button1.get('id'))
        .sort((val1, val2) => int(val1.get('id')).cmp(val2.get('id')))
        .toList()
        .push(button0)
        .push(number0)
        .push(button1)
        .toArray();
    } else {
      newNumbers = numbers
        .sort((val1, val2) => int(val1.get('id')).cmp(val2.get('id')))
        .valueSeq()
        .toArray();
    }

    return (
      <View style={Styles.container}>
        {isHorizontal ? (
          <FlatList data={newNumbers} horizontal renderItem={this.renderNumber} keyExtractor={this.keyExtractor} />
        ) : (
          <FlatList data={newNumbers} numColumns={numColumns} renderItem={this.renderNumber} keyExtractor={this.keyExtractor} />
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
