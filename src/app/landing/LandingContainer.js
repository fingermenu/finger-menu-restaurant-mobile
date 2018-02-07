// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LandingView from './LandingView';

class LandingContainer extends Component {
  static navigationOptions = {
    header: null,
  };

  render = () => {
    return <LandingView restaurantName={this.props.restaurantName} landing={this.props.landing} navigateToMenu={this.props.navigateToMenu} />;
  };
}

LandingContainer.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  landing: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const mockLanding = {
    uri:
      'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Fcover.jpg?alt=media&token=0a3f9bc2-1d2d-48c4-9f32-8b2207c1c76b',
    headerText: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
    introText: 'this is a great coffee',
    buttonText: 'Lunch menu',
  };

  return {
    landing: mockLanding,
    restaurantName: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToMenu: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
