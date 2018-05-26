// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { translate } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { TextInput } from '@microbusiness/redux-form-react-native-elements/src/index';
import { Avatar, Button } from 'react-native-elements';
import { DefaultColor, DefaultStyles } from '../../style';
import { CustomerProp } from '../../framework/applicationState';
import Styles from './Styles';

const CustomersView = ({ customers, t, handleSubmit }) => (
  <View>
    {customers.map(customer => (
      <View key={customer.cutomerId}>
        <View style={[DefaultStyles.rowContainer, Styles.customerRow]}>
          <Avatar size="large" rounded icon={{ name: 'person-outline', color: DefaultColor.iconColor }} activeOpacity={0.7} />
          <Field name={customer.customerId} component={TextInput} placeholder={t('notes.placeholder')} />
        </View>
      </View>
    ))}
    <Button onPress={handleSubmit} title={t('updateCustomers.button')} />
  </View>
);

CustomersView.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(CustomerProp).isRequired,
};

const mapStateToProps = (state, props) => {
  const initialValues = {};

  props.customers.map(customer => {
    initialValues[customer.customerId] = customer.name;
  });

  return {
    initialValues,
  };
};

export default connect(mapStateToProps)(reduxForm({ form: 'customers' })(translate()(CustomersView)));
