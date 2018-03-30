// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import MenuView from './MenuView';
import * as ordersActions from '../orders/Actions';
import * as applicationStateActions from '../../framework/applicationState/Actions';

class MenuContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  componentDidMount = () => {
    this.props.applicationStateActions.clearActiveMenuItemPrice();
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.handleRefresh();
    }
  };

  onViewMenuItemPressed = menuItemPriceId => {
    this.props.applicationStateActions.setActiveMenuItemPrice(Map({ id: menuItemPriceId }));
    this.props.navigateToMenuItem();
  };

  handleRefresh = () => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    });

    this.props.relay.refetchConnection(this.props.user.menuItemPrices.edges.length, () => {
      this.setState({
        isFetchingTop: false,
      });
    });
  };

  handleEndReached = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(30, () => {});
  };

  render = () => {
    const { user: { menuItemPrices }, inMemoryMenuItemPricesToOrder, navigateToOrders } = this.props;

    return (
      <MenuView
        menuItemPrices={menuItemPrices.edges
          .map(_ => _.node)
          .sort((menuItemPrice1, menuItemPrice2) => int(menuItemPrice1.sortOrderIndex).cmp(menuItemPrice2.sortOrderIndex))}
        inMemoryMenuItemPricesToOrder={inMemoryMenuItemPricesToOrder}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
        onPlaceOrderPressed={navigateToOrders}
      />
    );
  };
}

MenuContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToMenuItem: PropTypes.func.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  selectedLanguage: PropTypes.string.isRequired,
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
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    ordersActions: bindActionCreators(ordersActions, dispatch),
    navigateToMenuItem: () => dispatch(NavigationActions.navigate({ routeName: 'MenuItem' })),
    navigateToOrders: () => dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'HomeOrders' })] })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
