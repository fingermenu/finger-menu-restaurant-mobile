// @flow

import PropTypes from 'prop-types';

export const ChoiceItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const OrderChoiceItemPrice = PropTypes.shape({
  id: PropTypes.string.isRequired,
  choiceItem: ChoiceItemProp.isRequired,
  quantity: PropTypes.number.isRequired,
  currentPrice: PropTypes.number,
});

export const OrderItemDetailProp = PropTypes.shape({
  menuItemPriceId: PropTypes.string,
  orderChoiceItemPrices: PropTypes.arrayOf(OrderChoiceItemPrice),
  quantity: PropTypes.number,
});
