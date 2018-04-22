// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { graphql, QueryRenderer } from 'react-relay';
import OrdersRelayContainer from './OrdersRelayContainer';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import { screenNamePrefix } from '../../framework/AnalyticHelper';

class Orders extends Component {
  static navigationOptions = {
    headerTitle: 'Item',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  componentDidMount = () => {
    this.props.googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Orders` }));
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
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  restaurantId: PropTypes.string.isRequired,
  menuItemPriceIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  choiceItemPriceIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

const mapStateToProps = state => {
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
  const correlationId = state.applicationState.getIn(['activeOrder', 'correlationId']);

  return {
    restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
    tableId: state.applicationState.getIn(['activeTable', 'id']),
    menuItemPriceIds,
    choiceItemPriceIds,
    correlationId: correlationId ? correlationId : '',
  };
};

const mapDispatchToProps = dispatch => ({
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
