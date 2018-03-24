// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import OrderConfirmedView from './OrderConfirmedView';

class OrderConfirmedContainer extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  onAddMoreOrdersPressed = () => {
    this.props.navigateToPin();
  };

  render = () => {
    return <OrderConfirmedView onAddMoreOrdersPressed={this.onAddMoreOrdersPressed} />;
  };
}

function mapStateToProps() {
  return {};
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
