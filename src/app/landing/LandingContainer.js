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
    const { backgroundImageUrl, navigateToMenu } = this.props;

    return <LandingView backgroundImageUrl={backgroundImageUrl} onStartButtonPressed={navigateToMenu} />;
  };
}

LandingContainer.propTypes = {
  navigateToMenu: PropTypes.func.isRequired,
  backgroundImageUrl: PropTypes.string,
};

LandingContainer.defaultProps = {
  backgroundImageUrl: null,
};

function mapStateToProps(state) {
  return {
    backgroundImageUrl: state.applicationState.getIn(['activeRestaurant', 'configurations', 'images', 'primaryLandingPageBackgroundImageUrl']),
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
