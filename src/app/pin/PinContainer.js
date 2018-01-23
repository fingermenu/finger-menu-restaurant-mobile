// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';

class PinContainer extends Component {
  onPinMatched = () => {
    this.props.navigateToTables(this.props.restaurant);
  };

  render = () => {
    return <PinView onPinMatched={this.onPinMatched} matchingPin={this.props.restaurant.pin} />;
  };
}

function mapStateToProps(state, props) {
  return {
    restaurant: props.user.restaurants.edges[0].node,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToTables: restaurant =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Tables',
              params: {
                restaurantName: restaurant.name,
                restaurantId: restaurant.id,
              },
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PinContainer);
