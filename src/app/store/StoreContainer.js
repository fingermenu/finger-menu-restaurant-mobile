// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import StoreDetailView from './StoreDetailView';

class StoreContainer extends Component<any, Props, State> {
  handleClickHyperLink = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  handleVisitStorePressed = url => {
    this.handleClickHyperLink(url);
  };

  render = () => {
    return <StoreDetailView store={this.props.viewer.store} handleVisitStorePressed={this.handleVisitStorePressed} />;
  };
}

StoreContainer.propTypes = {};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreContainer);
