// @flow

import { TextInput } from '@microbusiness/redux-form-react-native-elements';
import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableProp } from '../tables/PropTypes';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';
import { NumberPad } from '../../components/redux-form-components';

const TableSetupView = ({ handleSubmit, onSetupTablePressed, onReserveTablePressed, onResetTablePressed, table: { name, tableState } }) => (
  <View style={Styles.container}>
    <View style={DefaultStyles.rowContainer}>
      <Text style={Styles.headerText}>Table {name}</Text>
    </View>
    <View>
      <View style={Styles.tableTextContainer}>
        <View style={Styles.labelContainer}>
          <Icon name="human-handsdown" size={35} type="material-community" />
        </View>
        <View style={Styles.valueContainer}>
          <Field name="numberOfAdults" component={NumberPad} isHorizontal maxNumber={16} />
        </View>
      </View>
      <View style={Styles.tableTextContainer}>
        <View style={Styles.labelContainer}>
          <Icon name="human-child" size={35} type="material-community" />
        </View>
        <View style={Styles.valueContainer}>
          <Field name="numberOfChildren" component={NumberPad} isHorizontal maxNumber={10} />
        </View>
      </View>
      <View style={Styles.tableTextContainer}>
        <View style={Styles.textFieldContainer}>
          <Field name="name" placeholder="Customer name" component={TextInput} leftIcon={<Icon name="user" type="simple-line-icon" size={24} />} />
        </View>
      </View>
      <View style={Styles.tableTextContainer}>
        <View style={Styles.textFieldContainer}>
          <Field
            name="notes"
            placeholder="Reservation notes"
            component={TextInput}
            leftIcon={<Icon name="note" type="simple-line-icon" size={24} />}
          />
        </View>
      </View>
    </View>
    <View style={Styles.buttonRowContainer}>
      <Button
        containerStyle={Styles.buttonContainer}
        title="Give to Guest"
        backgroundColor={DefaultColor.defaultButtonColor}
        icon={<Icon name="food" type="material-community" />}
        buttonStyle={Styles.button}
        onPress={handleSubmit(onSetupTablePressed)}
      />
      <Button
        containerStyle={{ padding: 20 }}
        title={tableState.key === 'reserved' ? 'Update Reserve' : 'Reserve'}
        backgroundColor="orange"
        icon={<Icon name="ios-clock-outline" type="ionicon" />}
        buttonStyle={Styles.button}
        onPress={handleSubmit(onReserveTablePressed)}
      />
      {tableState.key === 'reserved' ? (
        <Button
          containerStyle={Styles.buttonContainer}
          title="Reset Table"
          backgroundColor="red"
          icon={<Icon name="ios-clock-outline" type="ionicon" />}
          buttonStyle={Styles.button}
          onPress={onResetTablePressed}
        />
      ) : (
        <View />
      )}
    </View>
  </View>
);

TableSetupView.propTypes = {
  onSetupTablePressed: PropTypes.func.isRequired,
  onReserveTablePressed: PropTypes.func.isRequired,
  onResetTablePressed: PropTypes.func.isRequired,
  table: TableProp.isRequired,
};

function mapStateToProps(state, props) {
  return {
    initialValues: {
      numberOfAdults: props.table.numberOfAdults ? props.table.numberOfAdults : 2,
      numberOfChildren: props.table.numberOfChildren ? props.table.numberOfChildren : 0,
      name: props.table.customerName ? props.table.customerName : '',
      notes: props.table.notes ? props.table.notes : '',
    },
  };
}

export default connect(mapStateToProps)(reduxForm({ form: 'setupTable', enableReinitialize: true })(TableSetupView));
