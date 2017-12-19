// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LandingView from './LandingView';

class LandingContainer extends Component {
  render = () => {
    return <LandingView restaurantName="43 Degree" landings={this.props.landings} navigateToMenu={this.props.navigateToMenu} />;
  };
}

LandingContainer.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  landings: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
    }),
  ).isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

function mapStateToProps() {
  const mockLanding = [
    {
      uri:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fcover1.jpg?alt=media&token=8ed40cad-acd4-48f2-a886-ff694aa066ef',
      headerText: '43 Degree',
      introText: 'this is a great coffee',
      buttonText: 'Lunch menu',
    },
    {
      uri:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fcover2.jpg?alt=media&token=890bff05-bead-4fa9-9c4d-64365a3810d2',
      headerText: '43 Degree',
      introText: 'Nice food',
      buttonText: 'Coffee menu',
    },
    {
      uri:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fcover3.jpg?alt=media&token=4d3ba159-12c6-40a2-b850-62f08b572bad',
      headerText: '43 Degree',
      introText: 'Enjoy your food',
      buttonText: 'Kids menu',
    },
  ];

  return {
    landings: mockLanding,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToMenu: menuId =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Home',
          params: {
            menuId,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
