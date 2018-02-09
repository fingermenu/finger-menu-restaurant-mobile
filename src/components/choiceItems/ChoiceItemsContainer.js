// @flow

import React, { Component } from 'react';
import ChoiceItemsListView from './ChoiceItemsListView';
import { OrderOptionsProp } from './PropTypes';

class ChoiceItemsContainer extends Component {
  render = () => {
    return <ChoiceItemsListView choiceItemPrices={this.props.choiceItemPrices} />;
  };
}

ChoiceItemsContainer.propTypes = {
  choiceItemPrices: OrderOptionsProp,
};

export default ChoiceItemsContainer;
