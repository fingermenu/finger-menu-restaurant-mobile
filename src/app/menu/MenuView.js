// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import { FlatList, ScrollView, View } from 'react-native';
import { Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import int from 'int';
import { DishTypesProp, MenuItemPricesProp } from './PropTypes';
import MenuItemRow from './MenuItemRow';
import MenuFooterView from './MenuFooterView';
import { ListItemSeparator } from '../../components/list/';
import Styles from './Styles';

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
    const dishTypesWithMenuItemPrices = dishTypes.map(dishType => dishType.tag).map(tag => ({
      tag,
      menuItemPrices: menuItemPrices.filter(menuItemPrice => !!menuItemPrice.tags.find(_ => _.id.localeCompare(tag.id) === 0)),
    }));
    const menuItemPriceIdsWithDishType = dishTypesWithMenuItemPrices.reduce(
      (ids, value) => ids.concat(value.menuItemPrices.map(menuItemPrice => menuItemPrice.id)),
      List(),
    );
    const menuItemPricesWithoutDishType = menuItemPrices.filter(
      menuItemPrice => menuItemPriceIdsWithDishType.find(_ => _ === menuItemPrice.id) === undefined,
    );

    return (
      <ScrollView>
        {dishTypesWithMenuItemPrices.map(
          dishTypeWithMenuItemPrices =>
            dishTypeWithMenuItemPrices.menuItemPrices.length > 0 && (
              <View key={dishTypeWithMenuItemPrices.tag.id}>
                <Text style={Styles.dishTypeText}>{dishTypeWithMenuItemPrices.tag.name}</Text>
                <FlatList
                  data={dishTypeWithMenuItemPrices.menuItemPrices
                    .slice() // Reason to call slice here is Javascript sort function does not work on immutable array
                    .sort((menuItemPrice1, menuItemPrice2) => int(menuItemPrice1.sortOrderIndex).cmp(menuItemPrice2.sortOrderIndex))}
                  renderItem={this.renderRow}
                  keyExtractor={this.keyExtractor}
                  onEndReached={onEndReached}
                  onRefresh={onRefresh}
                  refreshing={isRefreshing}
                  ItemSeparatorComponent={this.renderItemSeparator}
                />
              </View>
            ),
        )}
        <FlatList
          data={menuItemPricesWithoutDishType
            .slice() // Reason to call slice here is Javascript sort function does not work on immutable array
            .sort((menuItemPrice1, menuItemPrice2) => int(menuItemPrice1.sortOrderIndex).cmp(menuItemPrice2.sortOrderIndex))}
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
      </ScrollView>
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
