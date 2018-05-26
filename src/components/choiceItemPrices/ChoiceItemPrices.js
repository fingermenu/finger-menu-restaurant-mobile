// @flow

import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { ChoiceItemPricesProp } from './PropTypes';
import ChoiceItemPrice from './ChoiceItemPrice';

class ChoiceItemPrices extends Component {
  validateMustChooseNumberOfChoiceItemPrices = (_, values) => {
    if (this.props.minNumberOfChoiceItemPrices > 0 || this.props.maxNumberOfChoiceItemPrices > 0) {
      const convertedValues = Immutable.fromJS(values);
      const menuItemPricesIds = convertedValues
        .keySeq()
        .filter(key => this.props.choiceItemPrices.find(choiceItemPrice => choiceItemPrice.id.localeCompare(key) === 0));

      if (this.props.minNumberOfChoiceItemPrices > 0) {
        const hasMinNumberOfChoiceItemPrices =
          menuItemPricesIds.filter(id => convertedValues.get(id)).count() >= this.props.minNumberOfChoiceItemPrices;

        if (hasMinNumberOfChoiceItemPrices) {
          if (this.props.maxNumberOfChoiceItemPrices > 0) {
            return menuItemPricesIds.filter(id => convertedValues.get(id)).count() <= this.props.maxNumberOfChoiceItemPrices
              ? undefined
              : `No more than ${this.props.minNumberOfChoiceItemPrices} of Choice Options can be selected`;
          }
        } else {
          return `At least ${this.props.minNumberOfChoiceItemPrices} of Choice Options is required`;
        }
      } else if (this.props.maxNumberOfChoiceItemPrices > 0) {
        return menuItemPricesIds.filter(id => convertedValues.get(id)).count() <= this.props.maxNumberOfChoiceItemPrices
          ? undefined
          : `No more than ${this.props.minNumberOfChoiceItemPrices} of Choice Options can be selected`;
      }

      return undefined;
    }

    return undefined;
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <ChoiceItemPrice choiceItemPrice={item} validateMustChooseNumberOfChoiceItemPrices={this.validateMustChooseNumberOfChoiceItemPrices} />
  );

  render = () => <FlatList data={this.props.choiceItemPrices} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
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
