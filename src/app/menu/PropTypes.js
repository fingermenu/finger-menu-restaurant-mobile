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
  currentPrice: PropTypes.number.isRequired,
  menuItem: MenuItemProp.isRequired,
});

export const MenuItemsProp = PropTypes.arrayOf(MenuItemProp);

export const MenuItemPricesProp = PropTypes.arrayOf(MenuItemPriceProp);

export const MenuTagProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
});

export const MenuTagsProp = PropTypes.arrayOf(MenuTagProp.isRequired);

export const ServingTimeProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tag: MenuTagProp.isRequired,
});

export const ServingTimesProp = PropTypes.arrayOf(ServingTimeProp.isRequired);

export const TagProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
});

export const TagsProp = PropTypes.arrayOf(TagProp.isRequired);

export const DishTypeProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tag: TagProp.isRequired,
});

export const DishTypesProp = PropTypes.arrayOf(DishTypeProp.isRequired);
