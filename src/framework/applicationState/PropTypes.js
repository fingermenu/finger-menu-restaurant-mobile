// @flow

import PropTypes from 'prop-types';

export const RestaurantConfigurtionsProp = PropTypes.shape({});

export const ActiveRestaurantProp = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  pin: PropTypes.string,
  configurations: RestaurantConfigurtionsProp,
});

export const TableStateProp = PropTypes.shape({
  id: PropTypes.string,
  key: PropTypes.string,
  name: PropTypes.string,
});

export const ActiveTableProp = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  tableState: TableStateProp,
  lastOrderCorrelationId: PropTypes.string,
});

export const ActiveCustomerProp = PropTypes.shape({
  name: PropTypes.string,
  reservationNotes: PropTypes.string,
  numberOfAdults: PropTypes.number,
  numberOfChildren: PropTypes.number,
});

export const ActiveMenu = PropTypes.shape({
  id: PropTypes.string,
});

export const ActiveMenuItemPrice = PropTypes.shape({
  id: PropTypes.string,
});

export const ActiveOrderMenuItemPrice = PropTypes.shape({
  id: PropTypes.string,
  menuItemPriceId: PropTypes.string,
});

export const MenuItemPriceProp = PropTypes.shape({
  menuItemPriceId: PropTypes.string.isRequired,
});

export const OrderDetailProp = PropTypes.shape({
  menuItemPrice: MenuItemPriceProp.isRequired,
});

export const OrderDetailsProp = PropTypes.arrayOf(OrderDetailProp.isRequired);

export const ActiveOrder = PropTypes.shape({
  correlationId: PropTypes.string,
  details: OrderDetailsProp.isRequired,
  notes: PropTypes.string,
});
