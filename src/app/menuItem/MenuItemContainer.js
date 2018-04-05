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
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => ({
        menuItemPriceId: _.menuItemPriceId,
      }));

      return {
        selectedLanguage: nextProps.selectedLanguage,
      };
    }

    return null;
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      quantity: props.quantity,
      selectedLanguage: props.selectedLanguage, // eslint-disable-line react/no-unused-state
    };
  }

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

  handleQuantityChanged = quantity => {
    this.setState({ quantity });
  };

  handleSubmit = values => {
    const { activeOrderMenuItemPriceId, user: { menuItemPrice: { id: menuItemPriceId, menuItem: { id: menuItemId } } } } = this.props;

    this.props.applicationStateActions.updateItemInActiveOrder(
      Map({
        id: activeOrderMenuItemPriceId ? activeOrderMenuItemPriceId : cuid(),
        quantity: this.state.quantity,
        notes: values.notes,
        paid: false,
        menuItemPrice: Map({
          id: menuItemPriceId,
          menuItem: Map({
            id: menuItemId,
          }),
        }),
        orderChoiceItemPrices: this.getSelectedChoiceItemPrices(values),
      }),
    );

    this.props.goBack();
  };

  render = () => {
    const { activeOrderMenuItemPriceId, user: { menuItemPrice }, order } = this.props;

    return (
      <MenuItemView
        menuItemPrice={menuItemPrice}
        order={order}
        isAddingOrder={activeOrderMenuItemPriceId === null}
        onSubmit={this.handleSubmit}
        quantity={this.state.quantity}
        onQuantityChanged={this.handleQuantityChanged}
      />
    );
  };
}

MenuItemContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  goBack: PropTypes.func.isRequired,
  activeOrderMenuItemPriceId: PropTypes.string,
};

MenuItemContainer.defaultProps = {
  activeOrderMenuItemPriceId: null,
};

function mapStateToProps(state) {
  const activeOrderMenuItemPrice = state.applicationState.get('activeOrderMenuItemPrice');
  const activeOrderDetail = activeOrderMenuItemPrice.isEmpty()
    ? null
    : state.applicationState.getIn(['activeOrder', 'details', activeOrderMenuItemPrice.get('id')]);

  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    activeOrderMenuItemPriceId: state.applicationState.getIn(['activeOrderMenuItemPrice', 'id']),
    quantity: activeOrderDetail ? activeOrderDetail.get('quantity') : 1,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
