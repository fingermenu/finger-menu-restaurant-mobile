// @flow

import PropTypes from 'prop-types';

export const ChoiceItemProp = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

export const ChoiceItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  currentPrice: PropTypes.number,
  choiceItem: ChoiceItemProp.isRequired,
});

export const ChoiceItemPricesProp = PropTypes.arrayOf(ChoiceItemPriceProp);
