// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import StapleItemsRelayContainer from './StapleItemsRelayContainer';
import HeaderContainer from './HeaderContainer';
import { LoadingInProgress } from '../../sharedComponents/loadingInProgress';
import { ErrorMessageWithRetry } from '../../sharedComponents/errorMessageWithRetry';
import { Color } from '../../framework/style/DefaultStyles';

class StapleItems extends Component {
  static navigationOptions = {
    headerTitle: <HeaderContainer environment={environment} />,
    headerStyle: { backgroundColor: Color.secondaryColorAction },
    headerTintColor: Color.headerIconDefaultColor,
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query StapleItemsQuery($count: Int!, $cursor: String, $searchKeyword: String) {
            user {
              ...StapleItemsRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 1000,
          searchKeyword: this.props.searchKeyword,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <StapleItemsRelayContainer user={props.user} shoppingListId={this.props.shoppingListId} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  }
}

StapleItems.propTypes = {
  searchKeyword: PropTypes.string,
};

function mapStateToProps(state, props) {
  return {
    searchKeyword: state.stapleItems.get('searchKeyword'),
    shoppingListId: props.navigation.state.params.shoppingListId,
  };
}

export default connect(mapStateToProps)(StapleItems);
