// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlaceOrderControlView from './PlaceOrderControlView';

class PlaceOrderControlContainer extends Component {
  render = () => {
    return <PlaceOrderControlView totalOrderQuantity={this.props.totalOrderQuantity} placeOrderPressed={() => {}} />;
  };
}

PlaceOrderControlContainer.propTypes = {
  totalOrderQuantity: PropTypes.number.isRequired,
};

export default PlaceOrderControlContainer;
