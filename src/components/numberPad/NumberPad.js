// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import Immutable, { Range } from 'immutable';
import Styles from './Styles';
import Number from './Number';

const initialStateWithoutResetButtons = Range(0, 10)
  .map(num => ({ id: num, name: num.toString(), isSelected: false }))
  .toJS();

const initialStateWithResetButtons = Range(0, 9)
  .map(num => ({ id: num, name: num.toString(), isSelected: false }))
  .toList()
  .push({ id: -1, name: ' ', isSelected: false })
  .push({ id: 9, name: '9', isSelected: false })
  .push({ id: -1, name: ' ', isSelected: false })
  .toJS();

// TODO: Consider replace it with redux form.
class NumberPad extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      numbers: this.props.supportReset ? initialStateWithResetButtons : initialStateWithoutResetButtons,
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
      onNumberPressed={this.onNumberPressed}
    />
  );
}

NumberPad.propTypes = {
  numColumns: PropTypes.number,
  isHorizontal: PropTypes.bool,
  supportHighlight: PropTypes.bool,
  supportReset: PropTypes.bool,
  onNumberPressed: PropTypes.func.isRequired,
  numberHeight: PropTypes.number,
};

NumberPad.defaultProps = {
  numColumns: 3,
  isHorizontal: false,
  supportHighlight: true,
  supportReset: false,
  numberHeight: 50,
};

export default NumberPad;
