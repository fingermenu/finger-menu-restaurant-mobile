// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { NavigationActions } from 'react-navigation';
import * as AsyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import PinView from './PinView';
import { bindActionCreators } from 'redux';

class OfflinePinContainer extends Component {
  componentWillMount = () => {
    this.props.AsyncStorageActions.writeValue(Map({ key: 'restaurantId', value: this.props.restaurant.id }));

    this.props.AsyncStorageActions.writeValue(Map({ key: 'pin', value: this.props.restaurant.pin }));

    this.props.AsyncStorageActions.writeValue(Map({ key: 'restaurantName', value: this.props.restaurant.name }));
  };

  onPinMatched = () => {
    this.props.navigateToTables();
  };

  render = () => {
    return <PinView onPinMatched={this.onPinMatched} matchingPin={this.props.restaurant.pin} restaurantName={this.props.restaurant.name} />;
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
    AsyncStorageActions: bindActionCreators(AsyncStorageActions, dispatch),
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
