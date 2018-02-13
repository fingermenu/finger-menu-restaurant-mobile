// @flow

import React from 'react';
import ChoiceItemsListView from './ChoiceItemsListView';
import { ChoiceItemPriceProp } from './PropTypes';

const ChoiceItemsContainer = ({ choiceItemPrices }) => <ChoiceItemsListView choiceItemPrices={choiceItemPrices} />;

ChoiceItemsContainer.propTypes = {
  choiceItemPrices: ChoiceItemPriceProp.isRequired,
};

export default ChoiceItemsContainer;
