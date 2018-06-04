// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import MenuView from './MenuView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class MenuContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isRefreshing: false,
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

  componentDidMount = () => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Menu` }));
  };

  onViewMenuItemPressed = id => {
    this.props.applicationStateActions.clearActiveOrderMenuItemPrice();

    const {
      user: {
        servingTimes: { edges: servingTimesEdges },
        menu: { tags: menuTags },
      },
    } = this.props;
    const servingTimes = servingTimesEdges.map(_ => _.node);
    const filteredServingTime = servingTimes.filter(servingTime => menuTags.find(menuTag => menuTag.id.localeCompare(servingTime.tag.id) === 0));

    this.props.applicationStateActions.setActiveMenuItemPrice(
      Map({ id, servingTimeId: filteredServingTime.length > 0 ? filteredServingTime[0].id : null }),
    );
    this.props.navigateToMenuItem();
  };

  handleRefresh = () => {
    if (this.state.isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    this.props.relay.refetch(_ => _, null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  handleEndReached = () => true;

  render = () => {
    const {
      user: {
        dishTypes: { edges: dishTypesEdges },
        menu: { menuItemPrices },
      },
      inMemoryMenuItemPricesToOrder,
      navigateToOrders,
    } = this.props;
    const dishTypes = dishTypesEdges.map(_ => _.node);

    return (
      <MenuView
        menuItemPrices={menuItemPrices}
        inMemoryMenuItemPricesToOrder={inMemoryMenuItemPricesToOrder}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
        onViewOrderPressed={navigateToOrders}
        dishTypes={dishTypes}
      />
    );
  };
}

MenuContainer.propTypes = {
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenuItem: PropTypes.func.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  navigateToOrders: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const inMemoryMenuItemPricesToOrder = state.applicationState
    .getIn(['activeOrder', 'details'])
    .map(item => Map({ id: item.getIn(['menuItemPrice', 'id']), quantity: item.get('quantity') }))
    .toList()
    .toJS();

  return {
    inMemoryMenuItemPricesToOrder,
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
};

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  navigateToMenuItem: () => dispatch(NavigationActions.navigate({ routeName: 'MenuItem' })),
  navigateToOrders: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'HomeOrders' })] })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuContainer);
