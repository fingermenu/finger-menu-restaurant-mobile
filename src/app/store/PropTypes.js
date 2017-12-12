// @flow

import PropTypes from 'prop-types';

export const StoreProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  address: PropTypes.string,
  phones: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    }),
  ),
  openingHours: PropTypes.shape({
    from: PropTypes.string.isRequired,
    until: PropTypes.string.isRequired,
  }),
  geoLocation: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
}).isRequired;
