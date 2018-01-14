// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlaceOrderControlView from './PlaceOrderControlView';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

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
          key: 'HomeNavigationTab',
          actions: [
            NavigationActions.navigate({
              routeName: 'Assist',
            }),
            // NavigationActions.navigate({
            //   routeName: 'Assist',
            // }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrderControlContainer);
