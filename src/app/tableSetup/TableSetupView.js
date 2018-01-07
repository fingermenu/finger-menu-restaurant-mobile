// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { TableProp } from '../tables/PropTypes';
import Styles from './Styles';
import { DefaultStyles } from '../../style/';
import { NumberPad } from '../../components/numberPad';

class TableSetupView extends Component {
  render = () => {
    return (
      <View style={Styles.container}>
        <Text style={Styles.headerText}>Setup table #{this.props.table.name}</Text>
        <View>
          <View style={DefaultStyles.rowContainer}>
            <Icon name="human-handsdown" size={35} type="material-community" />
            <Text style={Styles.numberText}>10</Text>
          </View>
          <View style={DefaultStyles.rowContainer}>
            <Icon name="human-child" size={25} type="material-community" />
            <Text style={Styles.numberText}>2</Text>
          </View>
        </View>
        <Button title="Set table" onPress={this.props.onSetupTablePressed} />
        <NumberPad onNumberPressed={() => {}} onOkPressed={() => {}} onClearPressed={() => {}} />
      </View>
    );
  };
}

TableSetupView.propTypes = {
  onSetupTablePressed: PropTypes.func.isRequired,
  table: TableProp,
};

export default TableSetupView;
