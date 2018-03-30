// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { MenuItemPricesProp } from './PropTypes';
import MenuItemRow from './MenuItemRow';
import { PlaceOrderControlContainer } from '../../components/placeOrderControl';
import { ListItemSeparator } from '../../components/list/';

class MenuView extends Component {
  getTotalOrderQuantity = () => Immutable.fromJS(this.props.inMemoryMenuItemPricesToOrder).reduce((total, value) => total + value.quantity, 0);

  hasOrdered = item => !!this.props.inMemoryMenuItemPricesToOrder.find(_ => _.id.localeCompare(item.id) === 0);

  keyExtractor = item => item.id;

  renderItemSeparator = () => <ListItemSeparator />;

  renderRow = info => (
    <MenuItemRow menuItemPrice={info.item} isOrdered={this.hasOrdered(info.item)} onViewMenuItemPressed={this.props.onViewMenuItemPressed} />
  );

  render = () => {
    const { inMemoryMenuItemPricesToOrder, isFetchingTop, onEndReached, onRefresh, menuItemPrices } = this.props;
    return (
      <View style={Styles.container}>
        <FlatList
          data={menuItemPrices}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={isFetchingTop}
          ItemSeparatorComponent={this.renderItemSeparator}
        />
        {inMemoryMenuItemPricesToOrder.length > 0 && <PlaceOrderControlContainer totalOrderQuantity={this.getTotalOrderQuantity()} />}
      </View>
    );
  };
}

MenuView.propTypes = {
  menuItemPrices: MenuItemPricesProp.isRequired,
  inMemoryMenuItemPricesToOrder: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, quantity: PropTypes.number.isRequired }).isRequired,
  ).isRequired,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool,
  onRefresh: PropTypes.func,
  onEndReached: PropTypes.func,
};

MenuView.defaultProps = {
  isFetchingTop: false,
  onRefresh: null,
  onEndReached: null,
};

export default MenuView;
