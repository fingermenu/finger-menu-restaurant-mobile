// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { MenuItemPricesProp } from './PropTypes';
import MenuItemRow from './MenuItemRow';
import { OrdersProp } from '../orders/PropTypes';
import { PlaceOrderControlContainer } from '../../components/placeOrderControl';

class MenuView extends Component {
  getTotalOrderQuantity = () => {
    return Immutable.fromJS(this.props.orders).reduce((total, value) => {
      return total + value.get('quantity');
    }, 0);
  };

  hasOrdered = item => {
    return Immutable.fromJS(this.props.orders).findIndex(order => order.get('menuItemId') === item.id) >= 0;
  };

  render = () => {
    return (
      <View style={Styles.container}>
        <FlatList
          data={this.props.menuItemPrices}
          renderItem={info => (
            <MenuItemRow
              menuItemPrice={info.item}
              isOrdered={this.hasOrdered(info.item)}
              onViewMenuItemPressed={this.props.onViewMenuItemPressed}
              // onAddMenuItemToOrder={this.props.onAddMenuItemToOrder}
              // onRemoveMenuItemFromOrder={this.props.onRemoveMenuItemFromOrder}
            />
          )}
          keyExtractor={item => item.id}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.isFetchingTop}
        />
        {this.props.orders.length > 0 ? <PlaceOrderControlContainer totalOrderQuantity={this.getTotalOrderQuantity()} /> : <View />}
      </View>
    );
  };
}

MenuView.propTypes = {
  menuItemPrices: MenuItemPricesProp.isRequired,
  orders: OrdersProp,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  // onAddMenuItemToOrder: PropTypes.func.isRequired,
  // onRemoveMenuItemFromOrder: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool,
  onRefresh: PropTypes.func,
  onEndReached: PropTypes.func,
};

export default MenuView;
