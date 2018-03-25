// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, QueryRenderer } from 'react-relay';
import OrdersRelayContainer from './OrdersRelayContainer';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';

class Orders extends Component {
  static navigationOptions = {
    headerTitle: 'Item',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return (
        <OrdersRelayContainer user={props.user} menuItemPriceIds={this.props.menuItemPriceIds} choiceItemPriceIds={this.props.choiceItemPriceIds} />
      );
    }

    return <LoadingInProgress />;
  };

  render = () => {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query OrdersQuery($tableId: ID!, $choiceItemPriceIds: [ID!], $menuItemPriceIds: [ID!]) {
            user {
              ...OrdersRelayContainer_user
            }
          }
        `}
        variables={{
          tableId: this.props.tableId,
          menuItemPriceIds: this.props.menuItemPriceIds,
          choiceItemPriceIds: this.props.choiceItemPriceIds,
        }}
        render={this.renderRelayComponent}
      />
    );
  };
}

Orders.propTypes = {
  menuItemPriceIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  choiceItemPriceIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

function mapStateToProps(state) {
  const menuItemPriceIds = state.order
    .getIn(['tableOrder', 'details'])
    .map(detail => detail.getIn(['menuItemPrice', 'id']))
    .toSet()
    .toJS();
  const choiceItemPriceIds = state.order
    .getIn(['tableOrder', 'details'])
    .toList()
    .map(detail => detail.get('orderChoiceItemPrices'))
    .flatMap(orderChoiceItemPrices => orderChoiceItemPrices.map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id'])))
    .toSet()
    .toJS();

  return {
    tableId: state.applicationState.getIn(['activeTable', 'id']),
    menuItemPriceIds,
    choiceItemPriceIds,
  };
}

export default connect(mapStateToProps)(Orders);
