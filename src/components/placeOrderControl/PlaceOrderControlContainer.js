// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PlaceOrderControlView from './PlaceOrderControlView';

class PlaceOrderControlContainer extends Component {
  onPlaceOrderPressed = () => {
    this.props.navigateToOrders();
  };

  render = () => {
    return <PlaceOrderControlView totalOrderQuantity={this.props.totalOrderQuantity} placeOrderPressed={this.onPlaceOrderPressed} />;
  };
}

PlaceOrderControlContainer.propTypes = {
  totalOrderQuantity: PropTypes.number.isRequired,
  navigateToOrders: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToOrders: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'HomeOrders',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrderControlContainer);
