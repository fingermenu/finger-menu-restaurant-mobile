// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import MenuView from './MenuView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { MenuTagsProp, ServingTimesProp } from './PropTypes';

class MenuContainer extends Component {
  componentDidMount = () => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
  };

  onViewMenuItemPressed = id => {
    this.props.applicationStateActions.clearActiveOrderMenuItemPrice();

    const { servingTimes, menuTags } = this.props;
    const filteredServingTime = servingTimes.filter(servingTime => menuTags.find(menuTag => menuTag.id.localeCompare(servingTime.tag.id) === 0));

    this.props.applicationStateActions.setActiveMenuItemPrice(
      Map({ id, servingTimeId: filteredServingTime.length > 0 ? filteredServingTime[0].id : null }),
    );
    this.props.navigateToMenuItem();
  };

  handleEndReached = () => true;

  render = () => {
    const { menuItemPrices, onRefresh, inMemoryMenuItemPricesToOrder, navigateToOrders, isRefreshing } = this.props;

    return (
      <MenuView
        menuItemPrices={menuItemPrices
          .slice() // Reason to call slice here is Javascript sort function does not work on immutable array
          .sort((menuItemPrice1, menuItemPrice2) => int(menuItemPrice1.sortOrderIndex).cmp(menuItemPrice2.sortOrderIndex))}
        inMemoryMenuItemPricesToOrder={inMemoryMenuItemPricesToOrder}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={this.handleEndReached}
        onPlaceOrderPressed={navigateToOrders}
      />
    );
  };
}

MenuContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isRefreshing: PropTypes.bool.isRequired,
  navigateToMenuItem: PropTypes.func.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  navigateToOrders: PropTypes.func.isRequired,
  menuTags: MenuTagsProp.isRequired,
  servingTimes: ServingTimesProp.isRequired,
  onRefresh: PropTypes.func,
};

MenuContainer.defaultProps = {
  onRefresh: null,
};

function mapStateToProps(state) {
  const inMemoryMenuItemPricesToOrder = state.applicationState
    .getIn(['activeOrder', 'details'])
    .map(item => Map({ id: item.getIn(['menuItemPrice', 'id']), quantity: item.get('quantity') }))
    .toList()
    .toJS();

  return {
    inMemoryMenuItemPricesToOrder,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToMenuItem: () => dispatch(NavigationActions.navigate({ routeName: 'MenuItem' })),
    navigateToOrders: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'HomeOrders' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
