// @flow

import React, { Component } from 'react';
import OrderFooterView from './AddToOrderView';

class AddToOrderContainer extends Component {
  addToOrderPressed = () => {};

  render = () => {
    return <OrderFooterView addToOrderPressed={this.addToOrderPressed} />;
  };
}

export default AddToOrderContainer;
