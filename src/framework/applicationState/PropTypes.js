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

export const CustomerProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
});

export const CustomersProp = PropTypes.arrayOf(CustomerProp.isRequired);

export const ActiveCustomersProp = PropTypes.shape({
  reservationNotes: PropTypes.string,
  customers: CustomersProp,
  activeCustomerId: PropTypes.string,
  numberOfAdults: PropTypes.number,
  numberOfChildren: PropTypes.number,
});

export const ActiveMenu = PropTypes.shape({
  id: PropTypes.string,
});

export const ActiveMenuItemPriceProp = PropTypes.shape({
  id: PropTypes.string,
});

export const ActiveOrderMenuItemPriceProp = PropTypes.shape({
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
