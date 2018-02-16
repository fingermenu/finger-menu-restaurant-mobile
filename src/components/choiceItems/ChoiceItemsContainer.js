// @flow

import React from 'react';
import ChoiceItemsListView from './ChoiceItemsListView';
import { ChoiceItemPricesProp } from './PropTypes';

const ChoiceItemsContainer = ({ choiceItemPrices }) => <ChoiceItemsListView choiceItemPrices={choiceItemPrices} />;

ChoiceItemsContainer.propTypes = {
  choiceItemPrices: ChoiceItemPricesProp.isRequired,
};

export default ChoiceItemsContainer;
