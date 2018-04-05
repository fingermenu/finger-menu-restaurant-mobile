// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import int from 'int';
import { MenuContainer } from '../menu';
import { DefaultColor } from '../../style';

class MenusContainer extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: screenProps.t('home.label'),
  });

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => ({ restaurant: _.restaurantId }));

      return {
        selectedLanguage: nextProps.selectedLanguage,
      };
    }

    return null;
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isRefreshing: false,
      selectedLanguage: props.selectedLanguage, // eslint-disable-line react/no-unused-state
    };
  }

  getMenusScreens = () =>
    this.props.user.restaurant.menus
      .slice() // Reason to call slice here is Javascript sort function does not work on immutable array
      .sort((menu1, menu2) => int(menu1.sortOrderIndex).cmp(menu2.sortOrderIndex))
      .reduce((reduction, menu) => {
        reduction[menu.id] = {
          screen: props => (
            <MenuContainer
              {...props}
              key={menu.id}
              menuItemPrices={menu.menuItemPrices}
              onRefresh={this.handleRefresh}
              isRefreshing={this.state.isRefreshing}
            />
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

MenusContainer.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  menuId: PropTypes.string,
};

MenusContainer.defaultProps = {
  menuId: undefined,
};

function mapStateToProps(state) {
  return {
    menuId: state.applicationState.getIn(['activeMenu', 'id']),
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

export default connect(mapStateToProps)(MenusContainer);
