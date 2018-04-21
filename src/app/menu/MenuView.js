// @flow

import React, { Component } from 'react';
import Immutable from 'immutable';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { DishTypesProp, MenuItemPricesProp } from './PropTypes';
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
    const { dishTypes, inMemoryMenuItemPricesToOrder, isRefreshing, onEndReached, onRefresh, menuItemPrices, onPlaceOrderPressed } = this.props;
    const convertedMenuItemPrices = Immutable.fromJS(menuItemPrices);
    const tagIds = convertedMenuItemPrices.flatMap(menuItemPrice => menuItemPrice.get('tags').map(tag => tag.get('id'))).toSet();
    const anyMenuItemTagedWithDishType = dishTypes.filter(dishType => tagIds.some(tagId => tagId.localeCompare(dishType.tag.id) === 0));

    return (
      <View style={Styles.container}>
        {anyMenuItemTagedWithDishType.length === 0 && (
          <FlatList
            data={menuItemPrices}
            renderItem={this.renderRow}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            ItemSeparatorComponent={this.renderItemSeparator}
          />
        )}
        {inMemoryMenuItemPricesToOrder.length > 0 && (
          <MenuFooterView totalOrderQuantity={this.getTotalOrderQuantity()} onPlaceOrderPressed={onPlaceOrderPressed} />
        )}
      </View>
    );
  };
}

MenuView.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onEndReached: PropTypes.func.isRequired,
  onPlaceOrderPressed: PropTypes.func.isRequired,
  menuItemPrices: MenuItemPricesProp.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  dishTypes: DishTypesProp.isRequired,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};

MenuView.defaultProps = {
  onRefresh: null,
};

export default MenuView;
