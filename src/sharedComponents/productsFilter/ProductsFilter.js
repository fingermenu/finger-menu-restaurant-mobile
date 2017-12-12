// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List, ListItem } from 'react-native-elements';
import debounce from 'lodash.debounce';
import ProductsFilterSorting from './ProductsFilterSorting';
import Styles from './Styles';
import { Color } from '../../framework/style/DefaultStyles';
import config from '../../framework/config';

class ProductsFilter extends Component {
  constructor(props, context) {
    super(props, context);

    this.gotoCategoryFilter = debounce(this.props.gotoCategoryFilter, config.navigationDelay);
    this.gotoStoreFilter = debounce(this.props.gotoStoreFilter, config.navigationDelay);
  }

  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.filterOptionContainer}>
          <Text style={Styles.filterTitle}>Sort order</Text>
          <ProductsFilterSorting sortOption={this.props.sortOption} onSortOptionChanged={this.props.onSortOptionChanged} />
        </View>
        <View style={Styles.filterOptionContainer}>
          <Text style={Styles.filterTitle}>Filter</Text>
          <List>
            <ListItem
              key={1}
              title="Categories"
              onPress={this.gotoCategoryFilter}
              leftIcon={{ name: 'list', type: 'material-icons' }}
              subtitle={<Text numberOfLines={1}>{this.props.categories.map(_ => _.name).toString()}</Text>}
              badge={{
                value: this.props.categories.length,
                textStyle: { color: 'white' },
                containerStyle: { backgroundColor: Color.secondaryColorAction },
              }}
            />
            <ListItem
              key={2}
              title="Stores"
              onPress={this.gotoStoreFilter}
              leftIcon={{ name: 'store', type: 'material-icons' }}
              subtitle={<Text numberOfLines={1}>{this.props.stores.map(_ => _.name).toString()}</Text>}
              badge={{
                value: this.props.stores.length,
                textStyle: { color: 'white' },
                containerStyle: { backgroundColor: Color.secondaryColorAction },
              }}
            />
          </List>
        </View>
      </View>
    );
  };
}

ProductsFilter.propTypes = {
  gotoCategoryFilter: PropTypes.func.isRequired,
  gotoStoreFilter: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string,
    }),
  ).isRequired,
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      storeId: PropTypes.string,
    }),
  ).isRequired,
  onSortOptionChanged: PropTypes.func.isRequired,
};

export default ProductsFilter;
