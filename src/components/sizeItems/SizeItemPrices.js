// @flow

import { RadioButtonGroup } from '@microbusiness/redux-form-react-native-elements';
import Immutable from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { Field } from 'redux-form';
import { SizeItemPricesProp } from './PropTypes';
import Styles from './Styles';
import { DefaultStyles } from '../../style';

class SizeItemPrices extends Component {
  validateMustChooseSize = sizes => {
    if (this.props.mustChooseSize) {
      return Immutable.fromJS(sizes).some(size => size) ? undefined : 'Size is required';
    }

    return undefined;
  };

  renderItem = id => {
    const {
      currentPrice,
      choiceItem: { name },
    } = this.props.sizeItemPrices.find(_ => _.id.localeCompare(id) === 0);

    return (
      <View style={Styles.optionContainer}>
        <Text style={DefaultStyles.primaryLabelFont}>{name}</Text>
        {currentPrice !== 0 && <Text style={[DefaultStyles.primaryLabelFont, Styles.price]}>${currentPrice.toFixed(2)}</Text>}
      </View>
    );
  };

  render = () => (
    <Field
      ids={this.props.sizeItemPrices.map(sizeItemPrice => sizeItemPrice.id)}
      name="sizes"
      component={RadioButtonGroup}
      renderItem={this.renderItem}
      validate={this.validateMustChooseSize}
    />
  );
}

SizeItemPrices.propTypes = {
  sizeItemPrices: SizeItemPricesProp.isRequired,
  mustChooseSize: PropTypes.bool,
};

SizeItemPrices.defaultProps = {
  mustChooseSize: false,
};

export default SizeItemPrices;
