// @flow

import cuid from 'cuid';
import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as applicationStateActions from '../../framework/applicationState/Actions';
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
          quantity: 1,
          notes: null,
          paid: false,
          choiceItemPrice: Map({
            id: choiceItemPrice.get('id'),
            choiceItem: Map({
              id: this.props.user.menuItemPrice.menuItem.id,
            }),
          }),
        }),
      );
  };

  handleAdd = values => {
    this.props.applicationStateActions.addItemToActiveOrder(
      Map({
        id: cuid(),
        quantity: values.quantity,
        notes: values.notes,
        paid: false,
        menuItemPrice: Map({
          id: this.props.user.menuItemPrice.id,
          menuItem: Map({
            id: this.props.user.menuItemPrice.menuItem.id,
          }),
        }),
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(values),
      }),
    );
  };

  handleUpdate = values => {
    this.props.applicationStateActions.updateItemInActiveOrder(
      Map({
        id: this.props.id,
        quantity: values.quantity,
        notes: values.notes,
        paid: false,
        menuItemPrice: Map({
          id: this.props.user.menuItemPrice.id,
          menuItem: Map({
            id: this.props.user.menuItemPrice.menuItem.id,
          }),
        }),
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(values),
      }),
    );
  };

  handleSubmit = values => {
    if (this.props.isAddingOrder) {
      this.handleUpdate(values);
    } else {
      this.handleAdd(values);
    }

    this.props.goBack();
  };

  render = () => {
    const { user: { menuItemPrice }, order, isAddingOrder } = this.props;

    return <MenuItemView menuItemPrice={menuItemPrice} order={order} isAddingOrder={isAddingOrder} onSubmit={this.handleSubmit} />;
  };
}

MenuItemContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  goBack: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    isAddingOrder: state.applicationState.get('activeOrderMenuItemPrice').isEmpty(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
