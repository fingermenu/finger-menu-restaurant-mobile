// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productsFilterActions from './Actions';
import ProductsFilter from './ProductsFilter';
import HeaderContainer from './HeaderContainer';
import { Color } from '../../framework/style/DefaultStyles';

class ProductsFilterContainer extends Component {
  static navigationOptions = {
    title: 'Filter',
    headerRight: <HeaderContainer onClearFilterPress={this.clearFilters} />,
    headerTintColor: Color.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
    // headerTitleStyle: {
    //   marginLeft: Platform.OS === 'ios' ? null : 100,
    // },
  };

  gotoCategoryFilter = () => {
    this.props.gotoScreen('CategoriesFilter');
  };

  gotoStoreFilter = () => {
    this.props.gotoScreen('StoresFilter');
  };

  onSortOptionChanged = sortOption => {
    this.props.productsFilterActions.sortOptionChanged(
      Map({
        sortOption,
      }),
    );
  };

  render = () => {
    return (
      <ProductsFilter
        sortOption={this.props.sortOption}
        categories={this.props.categories}
        stores={this.props.stores}
        gotoCategoryFilter={this.gotoCategoryFilter}
        gotoStoreFilter={this.gotoStoreFilter}
        onSortOptionChanged={this.onSortOptionChanged}
      />
    );
  };
}

ProductsFilterContainer.propTypes = {
  productsFilterActions: PropTypes.object.isRequired,
  gotoScreen: PropTypes.func.isRequired,
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
};

function mapStateToProps(state) {
  return {
    sortOption: state.productsFilter.get('sortOption'),
    categories: state.productsFilter.get('categories').toJS(),
    stores: state.productsFilter.get('stores').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoScreen: routeName =>
      dispatch(
        NavigationActions.navigate({
          routeName,
        }),
      ),
    productsFilterActions: bindActionCreators(productsFilterActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsFilterContainer);
