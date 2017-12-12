// @flow

import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ProductsProp } from './PropTypes';
import ProductListRow from './ProductListRow';
import { ListItemSeparator } from '../../../components/list';
import Styles from './Styles';

const ProductList = ({
  products,
  onItemSelectionChanged,
  onViewProductDetailPressed,
  isFetchingTop,
  onRefresh,
  onEndReached,
  hasProductsFilterSet,
}) => (
  <View style={Styles.container}>
    {products.length > 0 ? (
      <FlatList
        data={products}
        renderItem={info => (
          <ProductListRow
            product={info.item}
            animateOnProductSelected
            onItemSelectionChanged={onItemSelectionChanged}
            onViewProductDetailPressed={onViewProductDetailPressed}
          />
        )}
        keyExtractor={item => item.id}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={isFetchingTop}
        ItemSeparatorComponent={() => <ListItemSeparator />}
      />
    ) : (
      <View style={Styles.noMatchingProductContainer}>
        <Text style={Styles.noMatchingProductText}>
          {hasProductsFilterSet ? 'No matching products found, check your filter' : 'No matching products found'}
        </Text>
      </View>
    )}
  </View>
);

ProductList.propTypes = {
  products: ProductsProp,
  onItemSelectionChanged: PropTypes.func.isRequired,
  onViewProductDetailPressed: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  hasProductsFilterSet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    hasProductsFilterSet: !state.productsFilter.get('categories').isEmpty() || !state.productsFilter.get('stores').isEmpty(),
  };
}

export default connect(mapStateToProps)(ProductList);
