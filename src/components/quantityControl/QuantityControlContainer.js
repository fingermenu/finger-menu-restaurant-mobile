// @flow

import React from 'react';
import PropTypes from 'prop-types';
import QuantityControl from './QuantityControl';

const QuantityControlContainer = ({ quantity, onQuantityIncrease, onQuantityDecrease }) => (
  <QuantityControl quantity={quantity} onQuantityIncrease={onQuantityIncrease} onQuantityDecrease={onQuantityDecrease} />
);

QuantityControlContainer.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityIncrease: PropTypes.func.isRequired,
  onQuantityDecrease: PropTypes.func.isRequired,
};

export default QuantityControlContainer;
