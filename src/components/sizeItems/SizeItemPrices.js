// @flow

import { RadioButtonGroup } from '@microbusiness/redux-form-react-native-elements';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { Field } from 'redux-form';
import { SizeItemPricesProp } from './PropTypes';
import Styles from './Styles';

class SizeItemPrices extends Component {
  renderItem = id => {
    const sizeItemPrice = this.props.sizeItemPrices.find(_ => _.id.localeCompare(id) === 0);

    return (
      <View style={Styles.optionContainer}>
        <Text style={Styles.optionName}>{sizeItemPrice.choiceItem.name}</Text>
      </View>
    );
  };

  render = () => (
    <Field
      ids={this.props.sizeItemPrices.map(sizeItemPrice => sizeItemPrice.id)}
      name="sizes"
      component={RadioButtonGroup}
      renderItem={this.renderItem}
    />
  );
}

SizeItemPrices.propTypes = {
  sizeItemPrices: SizeItemPricesProp.isRequired,
};

export default SizeItemPrices;
