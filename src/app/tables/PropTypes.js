// @flow

import PropTypes from 'prop-types';

export const TableProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  numberOfAdults: PropTypes.number,
  numberOfChildren: PropTypes.number,
  customerName: PropTypes.string,
  notes: PropTypes.stringt,
  sortOrderIndex: PropTypes.number.isRequired,
  tableState: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }),
});

export const TablesProp = PropTypes.arrayOf(TableProp);
