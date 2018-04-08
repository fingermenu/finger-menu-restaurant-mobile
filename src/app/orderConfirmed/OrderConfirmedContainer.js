// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import OrderConfirmedView from './OrderConfirmedView';

class OrderConfirmedContainer extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render = () => <OrderConfirmedView onFingerMenuPressed={this.props.navigateToMenu} restaurantLogoImageUrl={this.props.restaurantLogoImageUrl} />;
}

OrderConfirmedContainer.propTypes = {
  navigateToMenu: PropTypes.func.isRequired,
  restaurantLogoImageUrl: PropTypes.string,
};

OrderConfirmedContainer.defaultProps = {
  restaurantLogoImageUrl: null,
};

function mapStateToProps(state) {
  return {
    restaurantLogoImageUrl: state.applicationState.getIn(['activeRestaurant', 'configurations', 'images', 'logoImageUrl']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToMenu: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmedContainer);
