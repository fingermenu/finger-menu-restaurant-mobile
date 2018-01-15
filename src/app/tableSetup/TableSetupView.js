// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { TableProp } from '../tables/PropTypes';
import Styles from './Styles';
import NumberPad from '../../components/numberPad/NumberPad';

class TableSetupView extends Component {
  render = () => {
    // const { t } = this.props;
    return (
      <View style={Styles.container}>
        <Text style={Styles.headerText}>Setup table #{this.props.table.name}</Text>
        <View>
          <View style={Styles.tableTextContainer}>
            <Icon name="human-handsdown" size={35} type="material-community" />
            <Text style={Styles.numberText}>{this.props.table.numberOfAdults}</Text>
            <NumberPad numColumns={10} onNumberPressed={() => {}} onOkPressed={() => {}} onClearPressed={() => {}} />
          </View>
          <View style={Styles.tableTextContainer}>
            <Icon name="human-child" size={25} type="material-community" />
            <Text style={Styles.numberText}>{this.props.table.numberOfChildren}</Text>
          </View>
          <View style={Styles.tableTextContainer}>
            <Text style={Styles.numberText}>Name</Text>
            <Text style={Styles.numberText}>{this.props.table.customerName}</Text>
          </View>
          <View style={Styles.tableTextContainer}>
            <Text style={Styles.numberText}>Reservation</Text>
            <Text style={Styles.numberText}>{this.props.table.reservation}</Text>
          </View>
        </View>
        {/*<Button title={t('setupTable.label')} onPress={this.props.onSetupTablePressed} />*/}
        <Button title="Setup" onPress={this.props.onSetupTablePressed} />
        {/*<NumberPad onNumberPressed={() => {}} onOkPressed={() => {}} onClearPressed={() => {}} />*/}
      </View>
    );
  };
}

TableSetupView.propTypes = {
  onSetupTablePressed: PropTypes.func.isRequired,
  table: TableProp,
};

export default TableSetupView;
