// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import SignInDisclaimer from './SignInDisclaimer';

class SignInDisclaimerContainer extends Component {
  gotoSignIn = () => {
    this.props.gotoScreen('SignInPricingDisclaimer');
  };

  render = () => {
    return <SignInDisclaimer disclaimerButtonClicked={this.gotoSignIn} />;
  };
}

SignInDisclaimerContainer.propTypes = {
  gotoScreen: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    gotoScreen: routeName =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: routeName,
            }),
          ],
          key: null,
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInDisclaimerContainer);
