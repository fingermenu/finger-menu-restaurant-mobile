// @flow

import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { ChoiceItemPricesProp } from './PropTypes';
import ChoiceItemPrice from './ChoiceItemPrice';

class ChoiceItemPrices extends Component {
  validateMustChooseNumberOfChoiceItemPrices = (_, values) => {
    const { minNumberOfChoiceItemPrices, maxNumberOfChoiceItemPrices, choiceItemPrices } = this.props;

    if (minNumberOfChoiceItemPrices > 0 || maxNumberOfChoiceItemPrices > 0) {
      const convertedValues = Immutable.fromJS(values);
      const menuItemPricesIds = convertedValues
        .keySeq()
        .filter(key => choiceItemPrices.find(choiceItemPrice => choiceItemPrice.id.localeCompare(key) === 0));

      if (minNumberOfChoiceItemPrices > 0) {
        const hasMinNumberOfChoiceItemPrices = menuItemPricesIds.filter(id => convertedValues.get(id)).count() >= minNumberOfChoiceItemPrices;

        if (hasMinNumberOfChoiceItemPrices) {
          if (maxNumberOfChoiceItemPrices > 0) {
            return menuItemPricesIds.filter(id => convertedValues.get(id)).count() <= maxNumberOfChoiceItemPrices
              ? undefined
              : `No more than ${minNumberOfChoiceItemPrices} of Choice Options can be selected`;
          }
        } else {
          return `At least ${minNumberOfChoiceItemPrices} of Choice Options is required`;
        }
      } else if (maxNumberOfChoiceItemPrices > 0) {
        return menuItemPricesIds.filter(id => convertedValues.get(id)).count() <= maxNumberOfChoiceItemPrices
          ? undefined
          : `No more than ${minNumberOfChoiceItemPrices} of Choice Options can be selected`;
      }

      return undefined;
    }

    return undefined;
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <ChoiceItemPrice choiceItemPrice={item} validateMustChooseNumberOfChoiceItemPrices={this.validateMustChooseNumberOfChoiceItemPrices} />
  );

  render = () => {
    const { choiceItemPrices } = this.props;

    return <FlatList data={choiceItemPrices} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
  };
}

ChoiceItemPrices.propTypes = {
  choiceItemPrices: ChoiceItemPricesProp.isRequired,
  minNumberOfChoiceItemPrices: PropTypes.number,
  maxNumberOfChoiceItemPrices: PropTypes.number,
};

ChoiceItemPrices.defaultProps = {
  minNumberOfChoiceItemPrices: 0,
  maxNumberOfChoiceItemPrices: 0,
};

export default ChoiceItemPrices;
