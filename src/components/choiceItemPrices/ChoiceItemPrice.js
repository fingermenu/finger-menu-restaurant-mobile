// @flow

import { CheckBox } from '@microbusiness/redux-form-react-native-elements';
import React from 'react';
import { View, Text } from 'react-native';
import { Field } from 'redux-form';
import { ChoiceItemPriceProp } from './PropTypes';
import Styles from './Styles';
import { DefaultStyles } from '../../style';

const ChoiceItemPrice = ({
  choiceItemPrice: {
    id,
    currentPrice,
    choiceItem: { name },
  },
}) => (
  <View style={Styles.optionRowContainer}>
    <View style={Styles.checkboxContainer}>
      <Field name={id} component={CheckBox} />
    </View>
    <View style={Styles.optionContainer}>
      <Text style={DefaultStyles.primaryLabelFont}>{name}</Text>
      {currentPrice !== 0 && <Text style={[DefaultStyles.primaryLabelFont, Styles.price]}>${currentPrice.toFixed(2)}</Text>}
    </View>
  </View>
);

ChoiceItemPrice.propTypes = {
  choiceItemPrice: ChoiceItemPriceProp.isRequired,
};

export default ChoiceItemPrice;
