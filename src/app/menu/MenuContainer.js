// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import MenuView from './MenuView';
import * as ordersActions from '../orders/Actions';

class MenuContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.handleRefresh();
    }
  };

  onViewMenuItemPressed = menuItemPriceId => {
    this.props.navigateToMenuItem(menuItemPriceId);
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
    return (
      <MenuView
        menuItemPrices={this.props.user.menuItemPrices.edges
          .map(_ => _.node)
          .sort((menuItemPrice1, menuItemPrice2) => int(menuItemPrice1.sortOrderIndex).cmp(menuItemPrice2.sortOrderIndex))}
        orders={this.props.orders}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
      />
    );
  };
}

MenuContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state) {
  const orders = state.order.getIn(['tableOrder', 'details']).isEmpty()
    ? []
    : state.order
      .getIn(['tableOrder', 'details'])
      .toSeq()
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          orderItemId: key,
        },
      ])
      .toList()
      .toJS();

  return {
    table: state.asyncStorage.getIn(['keyValues', 'servingTable']),
    orders: orders,
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ordersActions: bindActionCreators(ordersActions, dispatch),
    navigateToMenuItem: menuItemPriceId =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItemPriceId,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
