// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import ProductDetailRelayContainer from './ProductDetailRelayContainer';
import { LoadingInProgress } from '../../../sharedComponents/loadingInProgress';
import { ErrorMessageWithRetry } from '../../../sharedComponents/errorMessageWithRetry';
import { Color } from '../../../framework/style/DefaultStyles';

class ProductDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params ? (navigation.state.params.title ? navigation.state.params.title : '') : '',
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
    headerTintColor: Color.headerIconDefaultColor,
  });

  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query ProductDetailQuery($productId: ID!) {
            user {
              ...ProductDetailRelayContainer_user
            }
          }
        `}
        variables={{
          productId: this.props.productId,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <ProductDetailRelayContainer user={props.user} productId={this.props.productId} isInShoppingList={this.props.isInShoppingList} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  };
}

ProductDetail.propTypes = {
  productId: PropTypes.string.isRequired,
  isInShoppingList: PropTypes.bool.isRequired,
};

function mapStateToProps(state, props) {
  return {
    productId: props.navigation.state.params.productId,
    isInShoppingList: !!props.navigation.state.params.isInShoppingList,
  };
}

export default connect(mapStateToProps)(ProductDetail);
