// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import ReportsView from './ReportsView';

class ReportsContainer extends Component {
  handleDailyReportClicked = () => {};

  render = () => {
    return <ReportsView onDailyReportClicked={this.handleDailyReportClicked} />;
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  navigateToPin: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Pin' })] })),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportsContainer);
