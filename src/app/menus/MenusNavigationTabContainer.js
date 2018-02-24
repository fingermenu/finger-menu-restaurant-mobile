// @flow

import Immutable, { OrderedMap } from 'immutable';
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import int from 'int';
import { DefaultColor } from '../../style';
import { Menu } from '../menu';

class MenusNavigationTabContainer extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: screenProps.t('home.label'),
  });

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.props.relay.refetch(_ => ({
        restaurant: _.restaurantId,
      }));
    }
  };

  getMenusScreens = () =>
    Immutable.fromJS(this.props.menus)
      .sort((menu1, menu2) => int(menu1.get('sortOrderIndex')).cmp(menu2.get('sortOrderIndex')))
      .reduce(
        (reduction, menu) =>
          reduction.set(menu.get('id'), {
            screen: props => <Menu {...props} menuId={menu.get('id')} />,
            navigationOptions: {
              tabBarLabel: menu.get('name'),
              headerStyle: {
                backgroundColor: DefaultColor.defaultBannerColor,
              },
            },
          }),

        OrderedMap(),
      )
      .toJS();

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
    menuId: state.navigation.routes[0].routes[0].params ? state.navigation.routes[0].routes[0].params.menuId : undefined,
    selectedLanguage: state.localState.get('selectedLanguage'),
  };
}

export default connect(mapStateToProps)(MenusNavigationTabContainer);
