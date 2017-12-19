// @flow

import React, { Component } from 'react';
import OrderOptionsListView from './OrderOptionsListView';
import { OrderOptionsProp } from './PropTypes';

class OrderOptionsContainer extends Component {
  render = () => {
    return <OrderOptionsListView orderOptions={this.props.orderOptions} />;
  };
}

OrderOptionsContainer.propTypes = {
  orderOptions: OrderOptionsProp,
};

export default OrderOptionsContainer;
