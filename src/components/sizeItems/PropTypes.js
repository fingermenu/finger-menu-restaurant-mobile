// @flow

import PropTypes from 'prop-types';

export const ChoiceItemProp = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

export const SizeItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  currentPrice: PropTypes.number,
  choiceItem: ChoiceItemProp.isRequired,
});

export const SizeItemPricesProp = PropTypes.arrayOf(SizeItemPriceProp);
