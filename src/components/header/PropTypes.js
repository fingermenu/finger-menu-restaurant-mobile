// @flow

import PropTypes from 'prop-types';

export const LanguageProp = PropTypes.shape({
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
});

export const LanguagesProp = PropTypes.arrayOf(LanguageProp);
