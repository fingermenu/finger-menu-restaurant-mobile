// @flow

import { TextInput } from '@microbusiness/redux-form-react-native-elements';
import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';
import { NumberPad } from '../../components/redux-form-components';
import { ActiveTableProp } from '../../framework/applicationState';

const TableSetupView = ({
  t,
  table: {
    name,
    tableState: { key: tableStateKey },
  },
  handleSubmit,
  onSetupTablePressed,
  onReserveTablePressed,
  onResetTablePressed,
}) => (
  <View style={Styles.container}>
    <View style={DefaultStyles.rowContainer}>
      <Text style={Styles.headerText}>{t('table.label').replace('{tableName}', name)}</Text>
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
        <Field
          name="name"
          placeholder={t('customerName.placeholder')}
          component={TextInput}
          leftIcon={<Icon name="user" type="simple-line-icon" size={24} />}
        />
      </View>
      <View style={Styles.tableTextContainer}>
        <Field
          name="notes"
          placeholder={t('reservationNotes.placeholder')}
          component={TextInput}
          leftIcon={<Icon name="note" type="simple-line-icon" size={24} />}
        />
      </View>
    </View>
    <View style={Styles.buttonRowContainer}>
      <Button
        containerStyle={Styles.buttonContainer}
        title={t('giveToGuest.button')}
        backgroundColor={DefaultColor.defaultButtonColor}
        icon={<Icon name="food" type="material-community" />}
        buttonStyle={Styles.button}
        onPress={handleSubmit(onSetupTablePressed)}
      />
      <Button
        containerStyle={{ padding: 20 }}
        title={tableStateKey === 'reserved' ? t('updateReservation.button') : t('reserve.button')}
        backgroundColor="orange"
        icon={<Icon name="ios-clock-outline" type="ionicon" />}
        buttonStyle={Styles.button}
        onPress={handleSubmit(onReserveTablePressed)}
      />
      {tableStateKey === 'reserved' ? (
        <Button
          containerStyle={Styles.buttonContainer}
          title={t('resetTable.button')}
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
  table: ActiveTableProp.isRequired,
};

const mapStateToProps = state => {
  const activeTable = state.applicationState.get('activeTable');
  const activeCustomer = state.applicationState.get('activeCustomer');

  return {
    initialValues: {
      numberOfAdults: activeTable.get('numberOfAdults') || 2,
      numberOfChildren: activeTable.get('numberOfChildren') || 0,
      name: activeCustomer.get('name') || '',
      notes: activeCustomer.get('reservationNotes') || '',
    },
  };
};

export default connect(mapStateToProps)(reduxForm({ form: 'setupTable', enableReinitialize: true })(translate()(TableSetupView)));
