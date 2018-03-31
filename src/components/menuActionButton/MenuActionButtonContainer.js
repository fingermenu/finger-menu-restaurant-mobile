// @flow

import React, { Component } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import MenuActionButtonView from './MenuActionButtonView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { MenusProp } from './PropTypes';

class MenuActionButtonContainer extends Component {
  onMenuActionButtonPressed = id => {
    this.props.applicationStateActions.setActiveMenu(Map({ id }));
    this.props.navigateToMenu();
  };

  render = () => {
    return <MenuActionButtonView menus={this.props.menus} onMenuActionButtonPressed={this.onMenuActionButtonPressed} />;
  };
}

MenuActionButtonContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenu: PropTypes.func.isRequired,
  menus: MenusProp.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToMenu: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuActionButtonContainer);
