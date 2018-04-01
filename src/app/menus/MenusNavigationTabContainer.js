// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import int from 'int';
import { MenuContainer } from '../menu';
import { DefaultColor } from '../../style';

class MenusNavigationTabContainer extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: screenProps.t('home.label'),
  });

  state = {
    isRefreshing: false,
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.handleRefresh();
    }
  };

  getMenusScreens = () =>
    this.props.user.restaurant.menus
      .slice() // Reason to call slice here is Javascript sort function does not work on immutable array
      .sort((menu1, menu2) => int(menu1.sortOrderIndex).cmp(menu2.sortOrderIndex))
      .reduce((reduction, menu) => {
        reduction[menu.id] = {
          screen: props => (
            <MenuContainer {...props} menuItemPrices={menu.menuItemPrices} onRefresh={this.handleRefresh} isRefreshing={this.state.isRefreshing} />
          ),
          navigationOptions: {
            tabBarLabel: menu.name,
            headerStyle: {
              backgroundColor: DefaultColor.defaultBannerColor,
            },
          },
        };

        return reduction;
      }, {});

  getMenusTabConfig = () => {
    const MenusTabConfig = {
      lazy: true,
      tabBarPosition: 'top',
      ...TabNavigator.Presets.AndroidTopTabs,
      initialRouteName: this.props.menuId,
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

  handleRefresh = () => {
    if (this.state.isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    this.props.relay.refetch(_ => ({ restaurant: _.restaurantId }), null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  render = () => {
    const MenuNavigationTab = TabNavigator(this.getMenusScreens(), this.getMenusTabConfig());

    return <MenuNavigationTab />;
  };
}

MenusNavigationTabContainer.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  menuId: PropTypes.string,
};

MenusNavigationTabContainer.defaultProps = {
  menuId: undefined,
};

function mapStateToProps(state) {
  return {
    menuId: state.applicationState.getIn(['activeMenu', 'id']),
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

export default connect(mapStateToProps)(MenusNavigationTabContainer);
