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
          query OrdersQuery($restaurantId: ID!, $tableId: ID!, $choiceItemPriceIds: [ID!], $menuItemPriceIds: [ID!], $correlationId: ID) {
            user {
              ...OrdersRelayContainer_user
            }
          }
        `}
        variables={{
          restaurantId: this.props.restaurantId,
          tableId: this.props.tableId,
          menuItemPriceIds: this.props.menuItemPriceIds,
          choiceItemPriceIds: this.props.choiceItemPriceIds,
          correlationId: this.props.correlationId,
        }}
        render={this.renderRelayComponent}
      />
    );
  };
}

Orders.propTypes = {
  restaurantId: PropTypes.string.isRequired,
  menuItemPriceIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  choiceItemPriceIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

function mapStateToProps(state) {
  const menuItemPriceIds = state.applicationState
    .getIn(['activeOrder', 'details'])
    .map(item => item.getIn(['menuItemPrice', 'id']))
    .toSet()
    .toJS();
  const choiceItemPriceIds = state.applicationState
    .getIn(['activeOrder', 'details'])
    .toList()
    .map(item => item.get('orderChoiceItemPrices'))
    .flatMap(orderChoiceItemPrices => orderChoiceItemPrices.map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id'])))
    .toSet()
    .toJS();

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    tableId: state.applicationState.getIn(['activeTable', 'id']),
    menuItemPriceIds,
    choiceItemPriceIds,
    correlationId: state.applicationState.getIn(['activeOrder', 'correlationId']),
  };
}

export default connect(mapStateToProps)(Orders);
