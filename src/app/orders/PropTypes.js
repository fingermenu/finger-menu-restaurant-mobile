// @flow

import PropTypes from 'prop-types';

export const ExtraOption = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}).isRequired;

export const OrderItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  menuItemId: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  extraOptions: PropTypes.arrayOf(ExtraOption),
}).isRequired;

export const OrdersProp = PropTypes.arrayOf(OrderItemProp).isRequired;
