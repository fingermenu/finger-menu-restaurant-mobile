// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import SignInPricingDisclaimer from './SignInPricingDisclaimer';

class SignInPricingDisclaimerContainer extends Component {
  gotoSignIn = () => {
    this.props.gotoScreen('SignUpSignIn');
  };

  render = () => {
    return <SignInPricingDisclaimer disclaimerButtonClicked={this.gotoSignIn} />;
  };
}

SignInPricingDisclaimerContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SignInPricingDisclaimerContainer);
