// @flow

import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ChoiceItemPricesProp } from './PropTypes';
import ChoiceItemPrice from './ChoiceItemPrice';

class ChoiceItemPrices extends Component {
  keyExtractor = item => item.id;

  renderItem = ({ item }) => <ChoiceItemPrice choiceItemPrice={item} />;

  render = () => <FlatList data={this.props.choiceItemPrices} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
}

ChoiceItemPrices.propTypes = {
  choiceItemPrices: ChoiceItemPricesProp.isRequired,
};

export default ChoiceItemPrices;
