// @flow

import PropTypes from 'prop-types';

export const ProductProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  priceToDisplay: PropTypes.number,
  savingPercentage: PropTypes.number,
  saving: PropTypes.number,
  offerEndDate: PropTypes.string,
  size: PropTypes.string,
  unitPrice: PropTypes.shape({
    price: PropTypes.number.isRequired,
    size: PropTypes.string.isRequired,
  }),
  multiBuy: PropTypes.shape({
    awardQuantity: PropTypes.number.isRequired,
    awardValue: PropTypes.number.isRequired,
  }),
  store: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }),
}).isRequired;

export const ProductsProp = PropTypes.arrayOf(ProductProp).isRequired;

export const ShoppingListItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  productPriceId: PropTypes.string,
});

export const ShoppingListItemsProp = PropTypes.arrayOf(ShoppingListItemProp).isRequired;
