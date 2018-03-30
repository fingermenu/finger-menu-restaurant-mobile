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

  handleSubmit = values => {
    const { activeOrderMenuItemPriceId, user: { menuItemPrice: { id: menuItemPriceId, menuItem: { id: menuItemId } } } } = this.props;

    this.props.applicationStateActions.updateItemInActiveOrder(
      Map({
        id: activeOrderMenuItemPriceId ? activeOrderMenuItemPriceId : cuid(),
        quantity: values.quantity,
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
      <MenuItemView menuItemPrice={menuItemPrice} order={order} isAddingOrder={activeOrderMenuItemPriceId !== null} onSubmit={this.handleSubmit} />
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
  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    activeOrderMenuItemPriceId: state.applicationState.getIn(['activeOrderMenuItemPrice', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
