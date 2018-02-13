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
  getTotalOrderQuantity = () => {
    return Immutable.fromJS(this.props.orders).reduce((total, value) => {
      return total + value.getIn(['data', 'quantity']);
    }, 0);
  };

  hasOrdered = item => Immutable.fromJS(this.props.orders).findIndex(order => order.getIn(['data', 'menuItemPriceId']) === item.id) >= 0;

  keyExtractor = item => item.id;

  renderItemSeparator = () => <ListItemSeparator />;

  renderRow = info => (
    <MenuItemRow menuItemPrice={info.item} isOrdered={this.hasOrdered(info.item)} onViewMenuItemPressed={this.props.onViewMenuItemPressed} />
  );

  render = () => {
    return (
      <View style={Styles.container}>
        <FlatList
          data={this.props.menuItemPrices}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.isFetchingTop}
          ItemSeparatorComponent={this.renderItemSeparator}
        />
        {this.props.orders.length > 0 ? <PlaceOrderControlContainer totalOrderQuantity={this.getTotalOrderQuantity()} /> : <View />}
      </View>
    );
  };
}

MenuView.propTypes = {
  menuItemPrices: MenuItemPricesProp.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
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
