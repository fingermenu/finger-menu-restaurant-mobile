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

class MenuContainer extends Component {
  componentDidMount = () => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
  };

  onViewMenuItemPressed = id => {
    this.props.applicationStateActions.clearActiveOrderMenuItemPrice();
    this.props.applicationStateActions.setActiveMenuItemPrice(Map({ id }));
    this.props.navigateToMenuItem();
  };

  handleEndReached = () => true;

  render = () => {
    const { menuItemPrices, onRefresh, inMemoryMenuItemPricesToOrder, navigateToOrders } = this.props;

    return (
      <MenuView
        menuItemPrices={menuItemPrices.sort((menuItemPrice1, menuItemPrice2) =>
          int(menuItemPrice1.sortOrderIndex).cmp(menuItemPrice2.sortOrderIndex),
        )}
        inMemoryMenuItemPricesToOrder={inMemoryMenuItemPricesToOrder}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isFetchingTop={false}
        onRefresh={onRefresh}
        onEndReached={this.handleEndReached}
        onPlaceOrderPressed={navigateToOrders}
      />
    );
  };
}

MenuContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onRefresh: PropTypes.func.isRequired,
  navigateToMenuItem: PropTypes.func.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  navigateToOrders: PropTypes.func.isRequired,
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
