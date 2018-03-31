// @flow

import PropTypes from 'prop-types';

export const ChoiceItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
});

export const ChoiceItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  choiceItem: ChoiceItemProp.isRequired,
  currentPrice: PropTypes.number,
});

export const OrderChoiceItemPrice = PropTypes.shape({
  id: PropTypes.string.isRequired,
  choiceItemPrice: ChoiceItemPriceProp.isRequired,
  quantity: PropTypes.number,
  notes: PropTypes.number,
  paid: PropTypes.bool,
});

export const MenuItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
});

export const MenuItemPriceProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  menuItem: MenuItemProp.isRequired,
  currentPrice: PropTypes.number.isRequired,
});

export const OrderItemDetailProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  menuItemPrice: MenuItemPriceProp.isRequired,
  orderChoiceItemPrices: PropTypes.arrayOf(OrderChoiceItemPrice),
  notes: PropTypes.string,
  paid: PropTypes.bool,
  quantity: PropTypes.number,
});

export const OrderItemDetailsProp = PropTypes.arrayOf(OrderItemDetailProp.isRequired);

export const OrderProp = PropTypes.shape({
  details: OrderItemDetailsProp.isRequired,
  notes: PropTypes.string,
  customerName: PropTypes.string,
  numberOfAdults: PropTypes.number,
  numberOfChildren: PropTypes.number,
  restaurantId: PropTypes.string,
  tableId: PropTypes.string,
});

export const MenuProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const MenusProp = PropTypes.arrayOf(MenuProp.isRequired);
