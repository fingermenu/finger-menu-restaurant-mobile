// @flow

import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import Immutable, { Range } from 'immutable';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import NumberPad from '../../components/numberPad/NumberPad';
import { DefaultColor } from '../../style';
import Styles from './Styles';

class PinView extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      pins: this.getPinArray(),
    };
  }

  componentDidUpdate = () => {
    if (!this.state.error && this.state.pins.every(pin => pin.value !== null)) {
      this.validate(this.state.pins);
    }
  };

  getPinArray = () => {
    return Range(0, 4)
      .map(function(num) {
        return {
          id: num,
          value: null,
        };
      })
      .toJS();
  };

  validate = pins => {
    const pinString = Immutable.fromJS(pins).reduce((v, s) => {
      return v + s.get('value');
    }, '');

    // If matching pin
    if (pinString === this.props.matchingPin) {
      this.props.onPinMatched();
    } else {
      this.setState({
        error: true,
      });
    }
  };

  setPinNumber = number => {
    let pins;
    if (this.state.error) {
      // If already has error, reset pins to empty after starting entering new pni
      pins = Immutable.fromJS(this.getPinArray());
    } else {
      pins = Immutable.fromJS(this.state.pins);
    }
    const pinIndexToSet = pins.findIndex(pin => pin.get('value') === null);

    if (pinIndexToSet !== -1) {
      const newPins = pins
        .updateIn([pinIndexToSet, 'value'], function() {
          return number;
        })
        .toJS();
      this.setState({ pins: newPins, error: false });
    }
  };

  resetPins = () => {
    const newPins = this.getPinArray();
    this.setState({ pins: newPins, error: false });
  };

  onPinNumberPressed = number => {
    this.setPinNumber(number);
  };

  renderPinItem = item => {
    return (
      <View>
        <Icon size={46} name="dot-single" type="entypo" color={item.item.value !== null ? 'blue' : DefaultColor.iconColor} />
      </View>
    );
  };

  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.pinViewContainer}>
          <Text style={Styles.text}>Welcome to {this.props.restaurantName}</Text>
          <Text style={Styles.text}>Enter Your Pin</Text>
          <View style={Styles.pinContainer}>
            <FlatList data={this.state.pins} renderItem={this.renderPinItem} horizontal={true} keyExtractor={item => item.id} />
          </View>
          {this.state.error ? <Text style={Styles.errorText}>Invalid Pin</Text> : <Text style={Styles.text}>---</Text>}
          <View style={Styles.pinPadContainer}>
            <NumberPad
              maxNumber={10}
              numColumns={3}
              supportHighlight={false}
              supportReset={true}
              initialValue=""
              onNumberPressed={this.onPinNumberPressed}
              onOkPressed={() => {}}
              onClearPressed={() => {}}
            />
          </View>
        </View>
      </View>
    );
  };
}

PinView.propTypes = {
  matchingPin: PropTypes.string.isRequired,
  restaurantName: PropTypes.string.isRequired,
};

export default PinView;
