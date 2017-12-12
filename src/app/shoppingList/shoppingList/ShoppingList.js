// @flow

import React, { Component } from 'react';
import { environment } from '../../../framework/relay';
import { graphql, QueryRenderer } from 'react-relay';
import { MainMenuContainer } from '../../../sharedComponents/mainMenu';
import ShoppingListItemsRelayContainer from './ShoppingListItemsRelayContainer';
import HeaderContainer from './HeaderContainer';
import HeaderTitleContainer from './HeaderTitleContainer';
import { LoadingInProgress } from '../../../sharedComponents/loadingInProgress';
import { ErrorMessageWithRetry } from '../../../sharedComponents/errorMessageWithRetry';

export default class ShoppingList extends Component {
  static navigationOptions = () => ({
    headerTitle: <HeaderTitleContainer />,
    headerLeft: <MainMenuContainer />,
    headerRight: <HeaderContainer />,
  });

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query ShoppingListQuery($count: Int!, $cursor: String) {
            user {
              ...ShoppingListItemsRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 1000,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
          }

          if (props) {
            return <ShoppingListItemsRelayContainer user={props.user} />;
          }

          return <LoadingInProgress />;
        }}
      />
    );
  }
}
