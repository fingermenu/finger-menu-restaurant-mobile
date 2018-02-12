// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Styles from './Styles';
import { TableProp } from './PropTypes';
import Common from './Common';

class TableView extends Component {
  render = () => {
    const { table: { name, numberOfAdults, numberOfChildren, customerName, tableState } } = this.props;
    const style = Common.getTableStyle(tableState ? tableState.key : 'empty');

    return (
      <View style={Styles.tableOuterContainer}>
        <View style={Styles.tableContainer}>
          <Button
            raised
            large
            borderRadius={3}
            title={name}
            containerViewStyle={Styles.tableItemContainer}
            buttonStyle={[style, Styles.tableButton]}
            onPress={this.onTablePressed}
          />
          <View style={Styles.tableTextContainer}>
            <Text>{numberOfAdults ? numberOfAdults : 0}</Text>
            <Text>{numberOfChildren ? numberOfChildren : 0}</Text>
          </View>
        </View>
        <Text numberOfLines={1} style={Styles.customerNameText}>
          {customerName}
        </Text>
      </View>
    );
  };

  onTablePressed = () => this.props.onTablePressed(this.props.table);
}

TableView.propTypes = {
  onTablePressed: PropTypes.func.isRequired,
  table: TableProp.isRequired,
};

export default TableView;
