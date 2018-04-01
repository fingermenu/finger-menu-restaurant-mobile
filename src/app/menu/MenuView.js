// @flow

import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { MenuItemPricesProp } from './PropTypes';
import MenuItemRow from './MenuItemRow';
import MenuFooterView from './MenuFooterView';
import { ListItemSeparator } from '../../components/list/';

class MenuView extends Component {
  getTotalOrderQuantity = () => this.props.inMemoryMenuItemPricesToOrder.reduce((total, value) => total + value.quantity, 0);

  hasOrdered = item => !!this.props.inMemoryMenuItemPricesToOrder.find(_ => _.id.localeCompare(item.id) === 0);

  keyExtractor = item => item.id;

  renderItemSeparator = () => <ListItemSeparator />;

  renderRow = info => (
    <MenuItemRow menuItemPrice={info.item} isOrdered={this.hasOrdered(info.item)} onViewMenuItemPressed={this.props.onViewMenuItemPressed} />
  );

  render = () => {
    const { inMemoryMenuItemPricesToOrder, isRefreshing, onEndReached, onRefresh, menuItemPrices, onPlaceOrderPressed } = this.props;

    return (
      <View style={Styles.container}>
        <FlatList
          data={menuItemPrices}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          ItemSeparatorComponent={this.renderItemSeparator}
        />
        {inMemoryMenuItemPricesToOrder.length > 0 && (
          <MenuFooterView totalOrderQuantity={this.getTotalOrderQuantity()} onPlaceOrderPressed={onPlaceOrderPressed} />
        )}
      </View>
    );
  };
}

MenuView.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  onPlaceOrderPressed: PropTypes.func.isRequired,
  menuItemPrices: MenuItemPricesProp.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  onViewMenuItemPressed: PropTypes.func.isRequired,
};

export default MenuView;
