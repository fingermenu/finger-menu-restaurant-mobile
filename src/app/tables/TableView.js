// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import debounce from 'lodash.debounce';
import Styles from './Styles';
import { TableProp } from './PropTypes';
import Common from './Common';
import config from '../../framework/config';

class TableView extends Component {
  constructor(props, context) {
    super(props, context);

    this.onTablePressed = debounce(props.onTablePressed, config.navigationDelay);
  }

  handleTablePressed = () => this.onTablePressed(this.props.table);

  render = () => {
    const {
      table: { name, customers, tableState },
    } = this.props;
    const style = Common.getTableStyle(tableState ? tableState.key : 'empty');
    const numberOfAdults = customers ? customers.filter(customer => customer.type.localeCompare('A') === 0).length : 0;
    const numberOfChildren = customers ? customers.filter(customer => customer.type.localeCompare('C') === 0).length : 0;

    return (
      <View style={Styles.tableOuterContainer}>
        <View style={Styles.tableContainer}>
          <Button
            raised
            borderRadius={3}
            title={name}
            containerStyle={Styles.tableItemContainer}
            buttonStyle={[style, Styles.tableButton]}
            onPress={this.handleTablePressed}
          />
          <View style={Styles.tableTextContainer}>
            <Text>{numberOfAdults ? numberOfAdults : 0}</Text>
            <Text>{numberOfChildren ? numberOfChildren : 0}</Text>
          </View>
        </View>
      </View>
    );
  };
}

TableView.propTypes = {
  onTablePressed: PropTypes.func.isRequired,
  table: TableProp.isRequired,
};

export default TableView;
