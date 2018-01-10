// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { MenuItemsProp } from './PropTypes';
import MenuItemRow from './MenuItemRow';
import { OrdersProp } from '../orders/PropTypes';
import { PlaceOrderControlContainer } from '../../components/placeOrderControl';

class MenuView extends Component {
  getQuantity = item => {
    return Immutable.fromJS(this.props.orders).count(order => order.get('menuItemId') === item.id);
  };

  render = () => {
    return (
      <View style={Styles.container}>
        <FlatList
          data={this.props.menuItems}
          renderItem={info => (
            <MenuItemRow
              menuItem={info.item}
              orderQuantity={this.getQuantity(info.item)}
              onViewMenuItemPressed={this.props.onViewMenuItemPressed}
              onAddMenuItemToOrder={this.props.onAddMenuItemToOrder}
              onRemoveMenuItemFromOrder={this.props.onRemoveMenuItemFromOrder}
            />
          )}
          keyExtractor={item => item.id}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.isFetchingTop}
        />
        {this.props.orders.length > 0 ? <PlaceOrderControlContainer totalOrderQuantity={this.props.orders.length} /> : <View />}
      </View>
    );
  };
}

MenuView.propTypes = {
  menuItems: MenuItemsProp,
  orders: OrdersProp,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  onAddMenuItemToOrder: PropTypes.func.isRequired,
  onRemoveMenuItemFromOrder: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
};

export default MenuView;
