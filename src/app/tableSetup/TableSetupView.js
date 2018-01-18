// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { TableProp } from '../tables/PropTypes';
import Styles from './Styles';
import NumberPad from '../../components/numberPad/NumberPad';
import { DefaultColor, DefaultStyles } from '../../style';

class TableSetupView extends Component {
  render = () => {
    return (
      <View style={Styles.container}>
        <View style={DefaultStyles.rowContainer}>
          <Text style={Styles.headerText}>Setup table #{this.props.table.name}</Text>
        </View>
        <View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Icon name="human-handsdown" size={35} type="material-community" />
            </View>
            <View style={Styles.valueContainer}>
              <NumberPad
                isHorizontal={true}
                maxNumber={16}
                initialValue={2}
                onNumberPressed={() => {}}
                onOkPressed={() => {}}
                onClearPressed={() => {}}
              />
            </View>
            {/*<Text style={Styles.numberText}>{this.props.table.numberOfAdults}</Text>*/}
          </View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Icon name="human-child" size={35} type="material-community" />
            </View>
            <View style={Styles.valueContainer}>
              <NumberPad
                isHorizontal={true}
                maxNumber={10}
                initialValue={0}
                onNumberPressed={() => {}}
                onOkPressed={() => {}}
                onClearPressed={() => {}}
              />
            </View>
            {/*<Text style={Styles.numberText}>{this.props.table.numberOfAdults}</Text>*/}
          </View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Text style={Styles.numberText}>Name</Text>
            </View>
            <View style={Styles.valueContainer}>
              <Text style={Styles.numberText}>{this.props.table.customerName}</Text>
            </View>
          </View>
          <View style={Styles.tableTextContainer}>
            <Text style={Styles.numberText}>Reservation</Text>
            <Text style={Styles.numberText}>{this.props.table.reservation}</Text>
          </View>
        </View>
        {/*<Button title={t('setupTable.label')} onPress={this.props.onSetupTablePressed} />*/}
        <Button title="Setup" backgroundColor={DefaultColor.defaultButtonColor} onPress={this.props.onSetupTablePressed} />
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
