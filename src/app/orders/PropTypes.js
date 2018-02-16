// @flow

import PropTypes from 'prop-types';

export const ExtraOption = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const OrderItemDetailProp = PropTypes.shape({
  menuItemPriceId: PropTypes.string,
  orderChoiceItemPrices: PropTypes.arrayOf(ExtraOption),
  quantity: PropTypes.number,
});

export const OrderItemProp = PropTypes.shape({
  orderItemId: PropTypes.string.isRequired,
  data: OrderItemDetailProp,
});

export const OrderItemPropOptional = PropTypes.shape({
  id: PropTypes.string.isRequired,
  menuItemId: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  extraOptions: PropTypes.arrayOf(ExtraOption),
});

export const OrdersProp = PropTypes.arrayOf(OrderItemProp);
