// @flow

import React, { Component } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import MenuActionButtonView from './MenuActionButtonView';
import * as applicationStateActions from '../../framework/applicationState/Actions';

class MenuActionButtonContainer extends Component {
  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.props.relay.refetch(_ => ({
        restaurant: _.restaurantId,
      }));
    }
  };

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
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state, props) {
  return {
    menus: props.user.restaurant.menus,
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToMenu: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Home' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuActionButtonContainer);
