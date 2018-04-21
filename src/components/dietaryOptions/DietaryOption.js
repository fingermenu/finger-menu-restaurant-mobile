// @flow

import { CheckBox } from '@microbusiness/redux-form-react-native-elements';
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Field } from 'redux-form';
import { DietaryOptionProp } from './PropTypes';
import Styles from './Styles';

const DietaryOption = ({
  dietaryOption: {
    id,
    currentPrice,
    choiceItem: { name },
  },
  validateMustChooseDietaryOption,
}) => (
  <View style={Styles.optionRowContainer}>
    <View style={Styles.checkboxContainer}>
      <Field name={id} component={CheckBox} validate={validateMustChooseDietaryOption} />
    </View>
    <View style={Styles.optionContainer}>
      <Text style={Styles.optionName}>{name}</Text>
      {currentPrice !== 0 && <Text style={Styles.price}>${currentPrice.toFixed(2)}</Text>}
    </View>
  </View>
);

DietaryOption.propTypes = {
  dietaryOption: DietaryOptionProp.isRequired,
  validateMustChooseDietaryOption: PropTypes.func.isRequired,
};

export default DietaryOption;
