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
    return <LandingView restaurantName="43 Degree" landing={this.props.landing} navigateToMenu={this.props.navigateToMenu} />;
  };
}

LandingContainer.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  landing: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

function mapStateToProps() {
  const mockLanding = {
    uri:
      'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fcover1.jpg?alt=media&token=8ed40cad-acd4-48f2-a886-ff694aa066ef',
    headerText: '43 Degree',
    introText: 'this is a great coffee',
    buttonText: 'Lunch menu',
  };

  return {
    landing: mockLanding,
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
