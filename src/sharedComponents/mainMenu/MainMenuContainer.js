// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import MainMenu from './MainMenu';

class MainMenuContainer extends Component {
  render = () => {
    return <MainMenu openDrawer={this.props.openDrawer} />;
  };
}

MainMenuContainer.propTypes = {
  openDrawer: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    openDrawer: () => dispatch(NavigationActions.navigate({ routeName: 'DrawerOpen' })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenuContainer);
