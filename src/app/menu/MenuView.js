// @flow

import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { MenuItemsProps } from './PropTypes';
import MenuItemRow from './MenuItemRow';

const MenuView = ({ menuItems, onViewMenuItemPressed, isFetchingTop, onRefresh, onEndReached }) => (
  <View style={Styles.container}>
    <FlatList
      data={menuItems}
      renderItem={info => <MenuItemRow menuItem={info.item} onViewMenuItemPressed={onViewMenuItemPressed} />}
      keyExtractor={item => item.id}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={isFetchingTop}
    />
  </View>
);

MenuView.propTypes = {
  menuItems: MenuItemsProps,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
};

export default MenuView;
