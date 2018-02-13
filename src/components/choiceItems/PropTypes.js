// @flow

import PropTypes from 'prop-types';

export const ChoiceItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  priceToDisplay: PropTypes.string,
  type: PropTypes.string.isRequired,
});

export const ChoiceItemPricesProp = PropTypes.arrayOf(ChoiceItemPriceProp);
