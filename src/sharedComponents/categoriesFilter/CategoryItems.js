// @flow

import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';
import { ListItemSeparator } from '../../components/list';
import { CategoryItemsProp } from './PropTypes';
import Styles from './Styles';

const CategoryItems = ({ categories, selectedCategories, onCategoryItemSelectionChanged, isFetchingTop, onRefresh, onEndReached }) => (
  <View style={Styles.container}>
    <FlatList
      data={categories}
      renderItem={info => (
        <CategoryItem
          category={info.item}
          isSelected={selectedCategories.find(_ => _.id === info.item.id) != null}
          onCategoryItemSelectionChanged={onCategoryItemSelectionChanged}
        />
      )}
      keyExtractor={item => item.id}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={isFetchingTop}
      ItemSeparatorComponent={() => <ListItemSeparator />}
    />
  </View>
);

CategoryItems.propTypes = {
  categories: CategoryItemsProp,
  selectedCategories: CategoryItemsProp,
  onCategoryItemSelectionChanged: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
};

export default CategoryItems;
