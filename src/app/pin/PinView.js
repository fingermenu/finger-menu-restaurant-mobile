// @flow

import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import Immutable, { Range } from 'immutable';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import NumberPad from '../../components/numberPad/NumberPad';
import { DefaultColor, DefaultStyles, ScreenSize } from '../../style';
import Styles from './Styles';
import packageInfo from '../../../package.json';

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

  onPinNumberPressed = number => {
    this.setPinNumber(number);
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
      const newPins = pins.setIn([pinIndexToSet, 'value'], number).toJS();
      this.setState({ pins: newPins, error: false });
    }
  };

  validate = pins => {
    const pinString = pins.reduce((reduction, pin) => reduction + pin.value, '');
    const { matchingPin, secretPin, onSecretPinMatched, onPinMatched } = this.props;

    // If matching pin
    if (pinString === secretPin) {
      onSecretPinMatched();
    } else if (pinString === matchingPin) {
      onPinMatched();
    } else {
      this.setState({ error: true });
    }
  };

  resetPins = () => {
    const newPins = this.getPinArray();
    this.setState({ pins: newPins, error: false });
  };

  keyExtractor = item => item.id.toString();

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
        <Text style={[DefaultStyles.primaryLabelFont, Styles.text]}>Version {packageInfo.version}</Text>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.text]}>Enter Your Pin</Text>
        <View style={Styles.pinContainer}>
          <FlatList data={this.state.pins} renderItem={this.renderPinItem} horizontal keyExtractor={this.keyExtractor} />
        </View>
        {this.state.error ? (
          <Text style={[DefaultStyles.primaryTitleFont, Styles.errorText]}>Invalid Pin</Text>
        ) : (
          <Text style={Styles.text}>---</Text>
        )}
        <View style={Styles.pinPadContainer}>
          <NumberPad
            numColumns={3}
            supportHighlight={false}
            supportReset
            onNumberPressed={this.onPinNumberPressed}
            numberHeight={ScreenSize({ s: 60, l: 70, xl: 100 }, 100)}
          />
        </View>
      </View>
    );
  };
}

PinView.propTypes = {
  secretPin: PropTypes.string.isRequired,
  matchingPin: PropTypes.string.isRequired,
  onSecretPinMatched: PropTypes.func.isRequired,
  onPinMatched: PropTypes.func.isRequired,
};

export default PinView;
