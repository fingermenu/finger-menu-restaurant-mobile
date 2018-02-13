// @flow

import * as AsyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PinView from './PinView';

class PinContainer extends Component {
  componentWillMount = () => {
    this.props.AsyncStorageActions.writeValue(Map({ key: 'restaurantId', value: this.props.restaurant.id }));
    this.props.AsyncStorageActions.writeValue(Map({ key: 'pin', value: this.props.restaurant.pin }));
    this.props.AsyncStorageActions.writeValue(Map({ key: 'restaurantName', value: this.props.restaurant.name }));
    this.props.AsyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(this.props.restaurant.configurations) }));
  };

  onPinMatched = () => {
    this.props.navigateToTables();
  };

  render = () => {
    return <PinView onPinMatched={this.onPinMatched} matchingPin={this.props.restaurant.pin} restaurantName={this.props.restaurant.name} />;
  };
}

function mapStateToProps(state, props) {
  return {
    restaurant: props.user.restaurants.edges[0].node,
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

export default connect(mapStateToProps, mapDispatchToProps)(PinContainer);
