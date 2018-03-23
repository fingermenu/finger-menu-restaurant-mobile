// @flow

import PropTypes from 'prop-types';

export const TableProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  numberOfAdults: PropTypes.number,
  numberOfChildren: PropTypes.number,
  customerName: PropTypes.string,
  notes: PropTypes.stringt,
  tableState: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }),
});

export const TablesProp = PropTypes.arrayOf(TableProp);
