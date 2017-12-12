// @flow

import PropTypes from 'prop-types';

export const TagProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}).isRequired;

export const TagsProp = PropTypes.arrayOf(TagProp);

export const StapleItemProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tags: TagsProp,
  isCustomItem: PropTypes.bool,
}).isRequired;

export const StapleItemsProp = PropTypes.arrayOf(StapleItemProp).isRequired;
