// @flow

import React, { Component } from 'react';
import OrderConfirmedView from './OrderConfirmedView';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

class OrderConfirmedContainer extends Component {
  onAddMoreOrdersPressed = () => {
    this.props.navigateToPn();
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
    navigateToPn: () =>
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
