// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import MenuView from './MenuView';
import { MenuItemsProp } from './PropTypes';
import * as OrdersActions from '../orders/Actions';
import { OrdersProp } from '../orders/PropTypes';

class MenuContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  onViewMenuItemPressed = menuItem => {
    this.props.navigateToMenuItem(menuItem);
  };

  // onAddMenuItemToOrder = menuItem => {
  //   const newOrders = Immutable.fromJS(this.props.orders).concat({
  //     id: this.props.orders.length + 1,
  //     menuItemId: menuItem.Id,
  //     menuItem,
  //   });
  //
  //   this.props.ordersActions.menuOrderChanged(Map({ orders: newOrders }));
  // };
  //
  // onRemoveMenuItemFromOrder = menuItemId => {
  //   const orders = Immutable.fromJS(this.props.orders);
  //   const orderToRemoveIndex = orders.findIndex(order => order.get('menuItemId') === menuItemId);
  //   if (orderToRemoveIndex >= 0) {
  //     this.props.ordersActions.menuOrderChanged(Map({ orders: orders.delete(orderToRemoveIndex) }));
  //   }
  // };

  onRefresh = () => {
    // if (this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.setState({
    //   isFetchingTop: true,
    // });
    //
    // this.props.relay.refetchConnection(this.props.user.products.edges.length, () => {
    //   this.setState({
    //     isFetchingTop: false,
    //   });
    // });
  };

  onEndReached = () => {
    // if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.props.relay.loadMore(30, () => {});
  };
  render = () => {
    return (
      <MenuView
        menuItems={this.props.menuItems}
        orders={this.props.orders}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onAddMenuItemToOrder={this.onAddMenuItemToOrder}
        onRemoveMenuItemFromOrder={this.onRemoveMenuItemFromOrder}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.OnRefresh}
        onEndReached={this.OnEndReached}
      />
    );
  };
}

MenuContainer.propTypes = {
  menuItems: MenuItemsProp,
  orders: OrdersProp,
  ordersActions: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const mockOrderOptions = [
    {
      id: 'opt-1',
      name: 'chips',
      priceToDisplay: '$1',
      type: 'Extra',
    },
    {
      id: 'opt-2',
      name: 'Salad',
      priceToDisplay: '$3',
      type: 'Extra',
    },
    {
      id: 'opt-3',
      name: 'Medium',
      priceToDisplay: '',
      type: 'Spicy',
    },
    {
      id: 'opt-4',
      name: 'Hot',
      priceToDisplay: '',
      type: 'Spicy',
    },
  ];

  const mockMenuItems = [
    {
      id: 1,
      name: 'Fish & Chips',
      description: 'The most delicious food in the world. Fresh chips and fish of the day.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems2.jpg?alt=media&token=40d58c0b-b3fe-4664-81e8-1b285228bde3',
      priceToDisplay: '$5.50',
      orderOptions: mockOrderOptions,
    },
    {
      id: 2,
      name: 'Salad',
      description: 'Fresh vegs and blue cheese.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems3.jpg?alt=media&token=16b78c22-4359-4e50-a2a5-62c34894d04e',
      priceToDisplay: '$7.50',
      orderOptions: [],
    },
    {
      id: 3,
      name: 'Chicken',
      description: 'Grilled crispy chicken',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems4.jpg?alt=media&token=8fdb994f-4e93-4661-a6fd-e50e110f2a25',
      priceToDisplay: '$12.90',
      orderOptions: mockOrderOptions,
    },
  ];

  return {
    menuItems: mockMenuItems,
    orders: state.orders.get('orders').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ordersActions: bindActionCreators(OrdersActions, dispatch),
    navigateToMenuItem: menuItem =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
          params: {
            menuItem,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
