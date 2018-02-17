// @flow

import Immutable from 'immutable';
import React from 'react';
import int from 'int';
import ChoiceItemsListView from './ChoiceItemsListView';
import { ChoiceItemPricesProp } from './PropTypes';

const ChoiceItemsContainer = ({ choiceItemPrices }) => (
  <ChoiceItemsListView
    choiceItemPrices={Immutable.fromJS(choiceItemPrices)
      .sort((choiceItemPrice1, choiceItemPrice2) => int(choiceItemPrice1.get('sortOrderIndex')).cmp(choiceItemPrice2.get('sortOrderIndex')))
      .toJS()}
  />
);

ChoiceItemsContainer.propTypes = {
  choiceItemPrices: ChoiceItemPricesProp.isRequired,
};

export default ChoiceItemsContainer;
