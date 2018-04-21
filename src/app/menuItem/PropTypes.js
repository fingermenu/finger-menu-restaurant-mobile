// @flow

import PropTypes from 'prop-types';

export const MenuItemPriceRulesProp = PropTypes.shape({
  mustChooseSize: PropTypes.bool,
});

export const MenuItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
});

export const MenuItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  currentPrice: PropTypes.number.isRequired,
  menuItem: MenuItemProp.isRequired,
  rules: MenuItemPriceRulesProp,
});
