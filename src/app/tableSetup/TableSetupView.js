// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { TableProp } from '../tables/PropTypes';

class TableSetupView extends Component {
  render = () => {
    return (
      <View>
        <Text>Setup for table {this.props.table.name}</Text>
        <Button title="Set table" onPress={this.props.onSetupTablePressed} />
      </View>
    );
  };
}

TableSetupView.propTypes = {
  onSetupTablePressed: PropTypes.func.isRequired,
  table: TableProp,
};

export default TableSetupView;
