// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import ProductsRelayContainer from './ProductsRelayContainer';
import { LoadingInProgress } from '../../../sharedComponents/loadingInProgress';
import { ErrorMessageWithRetry } from '../../../sharedComponents/errorMessageWithRetry';
import { Color } from '../../../framework/style/DefaultStyles';

class Products extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params
      ? navigation.state.params.defaultSearchKeyword ? 'Products for ' + navigation.state.params.defaultSearchKeyword : ''
      : '',
    headerTintColor: Color.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
  });

  componentDidMount = () => {
    this.props.navigation.setParams({
      title: this.props.searchKeyword,
    });
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query ProductsQuery($count: Int!, $cursor: String, $searchKeyword: String, $sortOption: String, $categories: [String], $stores: [String]) {
            user {
              ...ProductsRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 30,
          searchKeyword: this.props.defaultSearchKeyword ? this.props.defaultSearchKeyword : this.props.searchKeyword,
          sortOption: this.props.defaultSortOption ? this.props.defaultSortOption : this.props.sortOption,
          categories: this.props.defaultCategories ? this.props.defaultCategories : this.props.categories, // Use default categories if supplied
          stores: this.props.defaultStores ? this.props.defaultStores : this.props.stores,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <ProductsRelayContainer user={props.user} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  }
}

Products.propTypes = {
  searchKeyword: PropTypes.string,
  sortOption: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  defaultCategories: PropTypes.arrayOf(PropTypes.string),
  defaultStores: PropTypes.arrayOf(PropTypes.string),
  defaultSortOption: PropTypes.string,
  defaultSearchKeyword: PropTypes.string,
  stores: PropTypes.arrayOf(PropTypes.string),
};

function mapStateToProps(state, props) {
  return {
    defaultCategories:
      props.navigation.state.params && props.navigation.state.params.defaultCategories
        ? props.navigation.state.params.defaultCategories
        : props.defaultCategories,
    defaultSortOption: props.defaultSortOption,
    defaultSearchKeyword:
      props.navigation.state.params && props.navigation.state.params.defaultSearchKeyword
        ? props.navigation.state.params.defaultSearchKeyword
        : props.defaultSearchKeyword,
    defaultStores:
      props.navigation.state.params && props.navigation.state.params.defaultStores
        ? props.navigation.state.params.defaultStores
        : props.defaultStores,
    searchKeyword: state.products.get('searchKeyword'),
    sortOption: state.productsFilter.get('sortOption'),
    categories: state.productsFilter.get('categories').isEmpty()
      ? null
      : state.productsFilter
          .get('categories')
          .map(_ => _.get('key'))
          .toJS(),
    stores: state.productsFilter.get('stores').isEmpty()
      ? null
      : state.productsFilter
          .get('stores')
          .map(_ => _.get('key'))
          .toJS(),
  };
}

export default connect(mapStateToProps)(Products);
