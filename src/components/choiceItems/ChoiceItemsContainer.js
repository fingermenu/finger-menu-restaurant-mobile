// @flow

import React from 'react';
import ChoiceItemsListView from './ChoiceItemsListView';
import { OrderOptionsProp } from './PropTypes';

const ChoiceItemsContainer = ({ choiceItemPrices }) => <ChoiceItemsListView choiceItemPrices={choiceItemPrices} />;

ChoiceItemsContainer.propTypes = {
  choiceItemPrices: OrderOptionsProp,
};

export default ChoiceItemsContainer;
