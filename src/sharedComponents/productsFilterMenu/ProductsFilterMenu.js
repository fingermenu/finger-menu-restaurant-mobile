// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Styles from './Styles';
import { TouchableIcon } from '../../components/touchableIcon';

const ProductsFilterMenu = ({ showProductsFilter, isFilterSet }) => (
  <View style={Styles.container}>
    <TouchableIcon
      onPress={showProductsFilter}
      iconContainerStyle={Styles.iconContainerStyle}
      iconColor={isFilterSet ? 'orange' : null}
      iconName="sliders"
      iconType="font-awesome"
    />
  </View>
);

ProductsFilterMenu.propTypes = {
  showProductsFilter: PropTypes.func.isRequired,
  isFilterSet: PropTypes.bool.isRequired,
};

export default ProductsFilterMenu;
