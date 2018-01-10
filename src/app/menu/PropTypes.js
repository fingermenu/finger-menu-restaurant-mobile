// @flow

import PropTypes from 'prop-types';

export const MenuItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  priceToDisplay: PropTypes.number,
  orderedQuantity: PropTypes.number,
}).isRequired;

export const MenuItemsProp = PropTypes.arrayOf(MenuItemProp).isRequired;
