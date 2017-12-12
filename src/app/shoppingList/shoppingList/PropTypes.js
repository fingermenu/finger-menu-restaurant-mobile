// @flow

import PropTypes from 'prop-types';

export const ShoppingListItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  productPriceId: PropTypes.string,
  stapleItemId: PropTypes.string,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  priceToDisplay: PropTypes.number,
  savingPercentage: PropTypes.number,
  saving: PropTypes.number,
  comments: PropTypes.string,
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
});

export const ShoppingListItemsProp = PropTypes.arrayOf(ShoppingListItemProp).isRequired;
