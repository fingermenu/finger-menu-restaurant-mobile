// @flow

/* eslint-disable react/no-multi-comp */
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import { Account } from '../account';
import i18n from '../../i18n';
import { HeaderContainer } from '../../components/header';
import { MenusRelayContainer } from '../menus';
import { InfoContainer } from '../info';
import { OrdersRelayContainer } from '../orders';

const tabScreens = {
  Menus: {
    screen: props => <MenusRelayContainer user={props.screenProps.user} />,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={30} style={{ color: tintColor }} />,
    },
  },
  Info: {
    screen: InfoContainer,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-information-circle' : 'ios-information-circle-outline'} size={30} style={{ color: tintColor }} />
      ),
    },
  },
  Orders: {
    screen: props => <OrdersRelayContainer user={props.screenProps.user} />,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-list-box' : 'ios-list-box-outline'} size={30} style={{ color: tintColor }} />
      ),
    },
  },
  Assist: {
    screen: Account,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-notifications' : 'ios-notifications-outline'} size={30} style={{ color: tintColor }} />
      ),
    },
  },
};

const tabConfig = {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: false,
  lazy: true,
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    tabStyle: {
      height: 49,
    },
    labelStyle: {
      fontSize: 9,
    },
    iconStyle: {
      marginTop: 2,
      marginBottom: 0,
    },
    style: {
      backgroundColor: DefaultColor.defaultHomeTabBackgroundColor,
    },
    inactiveTintColor: DefaultColor.defaultThemeColor,
    activeTintColor: DefaultColor.defaultBannerColor,
  },
  backBehavior: 'none',
};

const createHomeNavigationTab = ({ initialRouteName } = {}) => {
  class HomeNavigation extends Component {
    static navigationOptions = () => ({
      headerTitle: <HeaderContainer />,
    });

    renderRelayComponent = ({ error, props, retry }) => {
      if (error) {
        return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
      }

      if (props) {
        const HomeNavigationTab = TabNavigator(tabScreens, { ...tabConfig, initialRouteName });

        return <HomeNavigationTab screenProps={{ t: i18n.getFixedT(), user: props.user }} />;
      }

      return <LoadingInProgress />;
    };

    render = () => (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query HomeNavigationTabQuery($restaurantId: ID!, $tableId: ID!, $choiceItemPriceIds: [ID!], $menuItemPriceIds: [ID!]) {
            user {
              ...MenusRelayContainer_user
              ...OrdersRelayContainer_user
            }
          }
        `}
        variables={{
          restaurantId: this.props.restaurantId,
          tableId: this.props.tableId,
          menuItemPriceIds: this.props.menuItemPriceIds,
          choiceItemPriceIds: this.props.choiceItemPriceIds,
        }}
        render={this.renderRelayComponent}
      />
    );
  }

  const mapStateToProps = state => {
    const menuItemPriceIds = state.applicationState
      .getIn(['activeOrder', 'details'])
      .map(item => item.getIn(['menuItemPrice', 'id']))
      .toSet()
      .toJS();
    const choiceItemPriceIds = state.applicationState
      .getIn(['activeOrder', 'details'])
      .toList()
      .map(item => item.get('orderChoiceItemPrices'))
      .flatMap(orderChoiceItemPrices => orderChoiceItemPrices.map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id'])))
      .toSet()
      .toJS();

    return {
      restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
      tableId: state.applicationState.getIn(['activeTable', 'id']),
      menuItemPriceIds,
      choiceItemPriceIds,
    };
  };

  return connect(mapStateToProps)(HomeNavigation);
};

export const HomeNavigationTab = createHomeNavigationTab();
export const HomeNavigationOrdersTab = createHomeNavigationTab({ initialRouteName: 'Orders' });
