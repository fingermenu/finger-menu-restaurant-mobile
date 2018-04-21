// @flow

import PropTypes from 'prop-types';

export const ChoiceItemProp = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

export const DietaryOptionProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  currentPrice: PropTypes.number,
  choiceItem: ChoiceItemProp.isRequired,
});

export const DietaryOptionsProp = PropTypes.arrayOf(DietaryOptionProp);
