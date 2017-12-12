// @flow

import PropTypes from 'prop-types';

export const StoreItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
}).isRequired;

export const StoreItemsProp = PropTypes.arrayOf(StoreItemProp);
