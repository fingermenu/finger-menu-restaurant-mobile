// @flow

import PropTypes from 'prop-types';

export const MenuProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const MenusProp = PropTypes.arrayOf(MenuProp.isRequired);
