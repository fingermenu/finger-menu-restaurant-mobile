// @flow

import PropTypes from 'prop-types';

export const TableProp = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string,
  numberOfAdults: PropTypes.number,
  numberOfChildren: PropTypes.number,
}).isRequired;

export const TablesProp = PropTypes.arrayOf(TableProp).isRequired;
