// @flow

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { HeaderContainer } from '../../components/header/';
import ReportsView from './ReportsView';
import { DefaultColor } from '../../style';

class ReportsContainer extends Component {
  static navigationOptions = () => ({
    title: 'Reports',
    headerTitle: <HeaderContainer showOpenDrawerIcon />,
    headerTintColor: DefaultColor.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
  });

  handleDailyReportClicked = () => {
    this.props.navigateToDailyReport();
  };

  render = () => {
    return <ReportsView onDailyReportClicked={this.handleDailyReportClicked} />;
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  navigateToDailyReport: () => dispatch(NavigationActions.navigate({ routeName: 'DailyReport' })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportsContainer);
