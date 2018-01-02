// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PinView from './PinView';

class PinContainer extends Component {
  onOkPressed = () => {
    this.props.navigateToTarget('');
  };

  render = () => {
    return <PinView onOkPressed={this.onOkPressed} />;
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
