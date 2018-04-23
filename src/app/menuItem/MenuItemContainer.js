// @flow

import cuid from 'cuid';
import Immutable, { Map, OrderedMap, Range } from 'immutable';
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

  getSelectedChoiceItemPrices = values =>
    Immutable.fromJS(this.props.user.menuItemPrice.choiceItemPrices)
      .filter(choiceItemPrice => values[choiceItemPrice.get('id')] || values.sizes[choiceItemPrice.get('id')])
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

  handleQuantityChanged = quantity => {
    this.setState({ quantity });
  };

  handleSubmit = values => {
    const {
      activeOrderMenuItemPriceGroupId,
      servingTimeId,
      user: {
        menuItemPrice: {
          id: menuItemPriceId,
          menuItem: { id: menuItemId },
        },
      },
    } = this.props;
    const groupId = activeOrderMenuItemPriceGroupId ? activeOrderMenuItemPriceGroupId : cuid();
    const items = Range(0, this.state.quantity).reduce(reduction => {
      const id = cuid();

      return reduction.set(
        id,
        Map({
          id,
          groupId,
          quantity: 1,
          notes: values.notes,
          paid: false,
          servingTimeId,
          menuItemPrice: Map({
            id: menuItemPriceId,
            menuItem: Map({
              id: menuItemId,
            }),
          }),
          orderChoiceItemPrices: this.getSelectedChoiceItemPrices(values),
        }),
      );
    }, OrderedMap());

    this.props.applicationStateActions.addOrUpdateItemsInActiveOrder(Map({ items, groupId }));
    this.props.goBack();
  };

  render = () => {
    const {
      activeOrderMenuItemPriceGroupId,
      user: { dietaryOptions, sizes, menuItemPrice },
    } = this.props;

    return (
      <MenuItemView
        menuItemPrice={menuItemPrice}
        dietaryOptions={dietaryOptions.edges.map(_ => _.node)}
        sizes={sizes.edges.map(_ => _.node)}
        isAddingOrder={activeOrderMenuItemPriceGroupId === null}
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
  activeOrderMenuItemPriceGroupId: PropTypes.string,
  servingTimeId: PropTypes.string,
};

MenuItemContainer.defaultProps = {
  activeOrderMenuItemPriceGroupId: null,
  servingTimeId: null,
};

const mapStateToProps = state => {
  const activeOrderMenuItemPrice = state.applicationState.get('activeOrderMenuItemPrice');
  const activeOrderDetails = activeOrderMenuItemPrice.isEmpty()
    ? null
    : state.applicationState
      .getIn(['activeOrder', 'details'])
      .filter(item => item.get('groupId').localeCompare(activeOrderMenuItemPrice.get('groupId')) === 0);
  const activeMenuItemPrice = state.applicationState.get('activeMenuItemPrice');

  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    activeOrderMenuItemPriceGroupId: activeOrderMenuItemPrice.get('groupId'),
    quantity: activeOrderDetails ? activeOrderDetails.count() : 1,
    servingTimeId: activeMenuItemPrice.isEmpty() ? activeOrderMenuItemPrice.get('servingTimeId') : activeMenuItemPrice.get('servingTimeId'),
  };
};

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
