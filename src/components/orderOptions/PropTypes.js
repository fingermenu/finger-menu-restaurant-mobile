// @flow

import PropTypes from 'prop-types';

export const OrderOptionProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  priceToDisplay: PropTypes.number,
  type: PropTypes.string.isRequired,
}).isRequired;

export const OrderOptionsProp = PropTypes.arrayOf(OrderOptionProp).isRequired;
