// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import MenuActionButtonView from './MenuActionButtonView';

class MenuActionButtonContainer extends Component {
  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.props.relay.refetch(_ => ({
        restaurant: _.restaurantId,
      }));
    }
  };

  onMenuActionButtonPressed = menuId => {
    this.props.navigateToMenu(menuId);
  };

  render = () => {
    return <MenuActionButtonView menus={this.props.menus} onMenuActionButtonPressed={this.onMenuActionButtonPressed} />;
  };
}

MenuActionButtonContainer.propTypes = {
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
    navigateToMenu: menuId =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
              params: {
                menuId,
              },
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuActionButtonContainer);
