// @flow

import React, { Component } from 'react';
import { Text } from 'react-native';

class TableDetailView extends Component {
  render = () => {
    return <Text>Table detail for {this.props.table.name}</Text>;
  };
}

export default TableDetailView;
