// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QuantityControl from './QuantityControl';

class QuantityControlContainer extends Component {
  render = () => {
    return (
      <QuantityControl
        quantity={this.props.quantity}
        onQuantityIncrease={this.props.onQuantityIncrease}
        onQuantityDecrease={this.props.onQuantityDecrease}
      />
    );
  };
}

QuantityControlContainer.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityIncrease: PropTypes.func.isRequired,
  onQuantityDecrease: PropTypes.func.isRequired,
};

export default QuantityControlContainer;
