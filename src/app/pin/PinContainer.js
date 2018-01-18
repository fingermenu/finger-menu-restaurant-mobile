// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';

class PinContainer extends Component {
  onPinMatched = () => {
    //this.props.navigateToTarget('');
  };

  render = () => {
    return <PinView onPinMatched={this.onPinMatched} />;
  };
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToTarget: targetPage =>
      dispatch(
        NavigationActions.navigate({
          routeName: targetPage,
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PinContainer);
