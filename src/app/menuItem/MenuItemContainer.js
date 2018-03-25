// @flow

import cuid from 'cuid';
import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as ordersActions from '../orders/Actions';
import MenuItemView from './MenuItemView';

class MenuItemContainer extends Component {
  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.props.relay.refetch(_ => ({
        menuItemPriceId: _.menuItemPriceId,
      }));
    }
  };

  getSelectedChoiceItemPrices = values => {
    return Immutable.fromJS(this.props.user.menuItemPrice.choiceItemPrices)
      .filter(choiceItemPrice => values[choiceItemPrice.get('id')])
      .map(choiceItemPrice =>
        Map({
          id: cuid(),
          choiceItemPrice: Map({
            id: choiceItemPrice.get('id'),
            quantity: 1,
            notes: null,
            choiceItem: Map({
              id: this.props.user.menuItemPrice.menuItem.id,
            }),
          }),
        }),
      );
  };

  handleAdd = values => {
    this.props.ordersActions.addOrderItem(
      Map({
        id: cuid(),
        menuItemPrice: Map({
          id: this.props.user.menuItemPrice.id,
          quantity: values.quantity,
          notes: values.notes,
          menuItem: Map({
            id: this.props.user.menuItemPrice.menuItem.id,
          }),
        }),
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(values),
      }),
    );
  };

  handleUpdate = values => {
    this.props.ordersActions.updateOrderItem(
      Map({
        id: this.props.id,
        menuItemPrice: Map({
          id: this.props.user.menuItemPrice.id,
          quantity: values.quantity,
          notes: values.notes,
          menuItem: Map({
            id: this.props.user.menuItemPrice.menuItem.id,
          }),
        }),
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(values),
      }),
    );
  };

  handleSubmit = values => {
    if (this.props.isAddingToOrder) {
      this.handleAdd(values);
    } else {
      this.handleUpdate(values);
    }

    this.props.goBack();
  };

  render = () => {
    const { user: { menuItemPrice }, order, isAddingToOrder } = this.props;

    return <MenuItemView menuItemPrice={menuItemPrice} order={order} isAddingToOrder={isAddingToOrder} onSubmit={this.handleSubmit} />;
  };
}

MenuItemContainer.propTypes = {
  ordersActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  goBack: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    isAddingToOrder: ownProps.id === null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ordersActions: bindActionCreators(ordersActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
