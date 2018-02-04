// @flow

import PropTypes from 'prop-types';

export const MenuItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
});

export const MenuItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  currentPrice: PropTypes.number,
  menuItem: MenuItemProp.isRequired,
});

export const MenuItemsProp = PropTypes.arrayOf(MenuItemProp);

export const MenuItemPricesProp = PropTypes.arrayOf(MenuItemPriceProp);
