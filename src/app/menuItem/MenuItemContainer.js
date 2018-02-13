// @flow

import React from 'react';
import MenuItemView from './MenuItemView';

const MenuItemContainer = ({ user: { menuItemPrice }, order, orderItemId }) => (
  <MenuItemView menuItemPrice={menuItemPrice} order={order} orderItemId={orderItemId} />
);

export default MenuItemContainer;
