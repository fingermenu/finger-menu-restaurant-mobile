// @flow

import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';

const OfflinePinContainer = ({ pin, navigateToTables }) => <PinView onPinMatched={navigateToTables} matchingPin={pin} />;

function mapStateToProps(state) {
  return {
    pin: state.applicationState.getIn(['activeRestaurant', 'pin']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToTables: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Tables' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflinePinContainer);
