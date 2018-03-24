// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import OrderConfirmedView from './OrderConfirmedView';

class OrderConfirmedContainer extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  handleFingerMenuPressed = () => {
    this.props.navigateToPin();
  };

  render = () => <OrderConfirmedView onFingerMenuPressed={this.handleFingerMenuPressed} restaurantLogoImageUrl={this.props.restaurantLogoImageUrl} />;
}

function mapStateToProps(state) {
  return {
    restaurantLogoImageUrl: JSON.parse(state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations'])).images.logoImageUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToPin: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Pin',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmedContainer);
