// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableProp } from '../tables/PropTypes';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';
import { NumberPad, TextInput } from '../../components/redux-form-components';

const TableSetupView = ({ handleSubmit, onSetupTablePressed, onReserveTablePressed, table: { name } }) => (
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
        <View style={Styles.labelContainer}>
          <Text style={Styles.numberText}>Name</Text>
        </View>
        <View style={Styles.valueContainer}>
          <Field name="name" component={TextInput} />
        </View>
      </View>
      <View style={Styles.tableTextContainer}>
        <View style={Styles.labelContainer}>
          <Text style={Styles.numberText}>Reservation</Text>
        </View>
        <View style={Styles.valueContainer}>
          <Field name="notes" component={TextInput} />
        </View>
      </View>
    </View>
    <View style={DefaultStyles.rowContainer}>
      <Button
        title="Give to Guest"
        backgroundColor={DefaultColor.defaultButtonColor}
        icon={{ name: 'ios-body-outline', type: 'ionicon' }}
        buttonStyle={Styles.button}
        onPress={handleSubmit(onSetupTablePressed)}
      />
      <Button
        title="Reserve"
        backgroundColor="orange"
        icon={{ name: 'ios-clock-outline', type: 'ionicon' }}
        buttonStyle={Styles.button}
        onPress={handleSubmit(onReserveTablePressed)}
      />
    </View>
  </View>
);

TableSetupView.propTypes = {
  onSetupTablePressed: PropTypes.func.isRequired,
  onReserveTablePressed: PropTypes.func.isRequired,
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
