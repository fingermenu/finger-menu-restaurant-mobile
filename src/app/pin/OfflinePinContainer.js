// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';

class OfflinePinContainer extends Component {
  onPinMatched = () => {
    this.props.navigateToTables();
  };

  render = () => {
    const { restaurant: { pin, name } } = this.props;

    return <PinView onPinMatched={this.onPinMatched} matchingPin={pin} restaurantName={name} />;
  };
}

function mapStateToProps(state) {
  return {
    restaurant: {
      id: state.asyncStorage.getIn(['keyValues', 'restaurantId']),
      name: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
      pin: state.asyncStorage.getIn(['keyValues', 'pin']),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToTables: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Tables',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflinePinContainer);
