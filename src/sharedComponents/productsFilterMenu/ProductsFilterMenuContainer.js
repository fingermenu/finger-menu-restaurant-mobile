// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import ProductsFilterMenu from './ProductsFilterMenu';

class ProductsFilterMenuContainer extends Component {
  showProductsFilter = () => {
    this.props.showProductsFilter();
  };

  render = () => {
    return <ProductsFilterMenu showProductsFilter={this.showProductsFilter} isFilterSet={this.props.isFilterSet} />;
  };
}

ProductsFilterMenuContainer.propTypes = {
  showProductsFilter: PropTypes.func.isRequired,
  isFilterSet: PropTypes.bool,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    showProductsFilter: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ProductsFilter',
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsFilterMenuContainer);
