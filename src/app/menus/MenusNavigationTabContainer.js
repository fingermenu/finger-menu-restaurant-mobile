// @flow

import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
// import PropTypes from 'prop-types';
import { DefaultColor } from '../../style';
import MenuContainer from '../menu/MenuContainer';
import { connect } from 'react-redux';

class MenusNavigationTabContainer extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: screenProps.t('home.label'),
  });

  getMenusScreens = () => {
    let MenusScreens = {};

    for (let i = 0; i < this.props.menus.length; i++) {
      const menu = this.props.menus[i];
      MenusScreens[menu.id] = {
        screen: MenuContainer,
        navigationOptions: {
          tabBarLabel: menu.name,
          headerStyle: {
            backgroundColor: DefaultColor.defaultBannerColor,
          },
        },
      };
    }

    return MenusScreens;
  };

  getMenusTabConfig = () => {
    const MenusTabConfig = {
      lazy: true,
      tabBarPosition: 'top',
      ...TabNavigator.Presets.AndroidTopTabs,
      tabBarOptions: {
        scrollEnabled: true,
        showIcon: false,
        tabStyle: {
          width: 150,
        },
        labelStyle: {
          fontSize: 13,
        },
        iconStyle: {
          marginBottom: 0,
        },
        style: {
          backgroundColor: DefaultColor.defaultBannerColor,
        },
        activeTintColor: '#FAFBFA',
      },
      backBehavior: 'none',
    };

    return MenusTabConfig;
  };

  render = () => {
    const MenuNavigationTab = TabNavigator(this.getMenusScreens(), this.getMenusTabConfig());
    return <MenuNavigationTab />;
  };
}

MenusNavigationTabContainer.propTypes = {
  // TODO: Add menus props
};

function mapStateToProps(state, props) {
  return {
    menus: props.user.restaurant.menus,
  };
}

export default connect(mapStateToProps)(MenusNavigationTabContainer);
