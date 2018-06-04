// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import int from 'int';
import { Menu } from '../menu';
import { DefaultColor } from '../../style';

class MenusContainer extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: screenProps.t('home.label'),
  });

  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedLanguage: props.selectedLanguage, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => _);

      return {
        selectedLanguage: nextProps.selectedLanguage,
      };
    }

    return null;
  };

  getMenusScreens = () =>
    this.props.user.restaurant.menus
      .slice() // Reason to call slice here is Javascript sort function does not work on immutable array
      .sort((menu1, menu2) => int(menu1.sortOrderIndex).cmp(menu2.sortOrderIndex))
      .reduce((reduction, menu) => {
        reduction[menu.id] = {
          screen: props => <Menu {...props} key={menu.id} menuId={menu.id} />,
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
      lazy: false,
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

const mapStateToProps = state => ({
  menuId: state.applicationState.getIn(['activeMenu', 'id']),
  selectedLanguage: state.applicationState.get('selectedLanguage'),
});

export default connect(mapStateToProps)(MenusContainer);
