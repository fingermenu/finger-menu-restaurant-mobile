// @flow

import PropTypes from 'prop-types';

export const CategoryItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
}).isRequired;

export const CategoryItemsProp = PropTypes.arrayOf(CategoryItemProp);
