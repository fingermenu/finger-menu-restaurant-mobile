// @flow

import { TouchableItem, TouchableIcon } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { OrderItemDetailProp } from './PropTypes';
import config from '../../framework/config';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';

class OrderItemRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.onViewOrderItemPressedDebounced = debounce(this.props.onViewOrderItemPressed, config.navigationDelay);

    this.state = { orderItem: Immutable.fromJS(props.orderItem) };
  }

  componentWillReceiveProps = nextProps => {
    const orderItem = Immutable.fromJS(nextProps.orderItem);

    if (!this.state.orderItem.equals(orderItem)) {
      this.setState({ orderItem });
    }
  };

  shouldComponentUpdate = nextProps => {
    const nextOrderItem = Immutable.fromJS(nextProps.orderItem);

    return this.state.orderItem.get('id') === nextOrderItem.get('id');
  };

  handleRemoveOrderPressed = () => {
    this.props.onRemoveOrderPressed(this.props.orderItem);
  };

  handleViewOrderItemPressed = () => {
    this.onViewOrderItemPressedDebounced(this.props.orderItem);
  };

  handleOrderItemSelected = () => {
    if (this.props.onOrderSelected) {
      this.props.onOrderSelected(this.props.orderItem, !this.props.isSelected);
    }
  };

  renderChoiceItemPrices = orderChoiceItemPrices =>
    orderChoiceItemPrices.map(orderChoiceItemPrice => (
      <Text key={orderChoiceItemPrice.id} style={Styles.extraOptions}>
        {orderChoiceItemPrice.choiceItemPrice.choiceItem.name} -{' '}
        {orderChoiceItemPrice.choiceItemPrice.currentPrice ? '$' + orderChoiceItemPrice.choiceItemPrice.currentPrice.toFixed(2) : ''}
      </Text>
    ));

  render = () => {
    const { t, orderItem, isSelected, showRemove, enableMultiSelection } = this.props;
    const { orderChoiceItemPrices, notes, quantity, paid, menuItemPrice: { currentPrice, menuItem: { name, imageUrl } } } = orderItem;
    const totalPrice =
      currentPrice * quantity +
      quantity *
        orderChoiceItemPrices.reduce(
          (totalChoiceItemPrices, orderChoiceItemPrice) =>
            totalChoiceItemPrices + orderChoiceItemPrice.quantity * orderChoiceItemPrice.choiceItemPrice.currentPrice,
          0.0,
        );

    return (
      <TouchableItem onPress={this.handleViewOrderItemPressed}>
        <View style={[DefaultStyles.rowContainer, Styles.orderRowContainer]}>
          <View style={Styles.imageContainer}>
            {imageUrl ? <FastImage style={Styles.image} resizeMode={FastImage.resizeMode.contain} source={{ uri: imageUrl }} /> : <View />}
          </View>
          {enableMultiSelection &&
            !paid && (
            <CheckBox
              center
              size={28}
              iconType="material-community"
              checkedIcon="check-circle-outline"
              uncheckedIcon="checkbox-blank-circle-outline"
              checked={isSelected}
              onPress={this.handleOrderItemSelected}
            />
          )}
          <View style={Styles.quantityContainer}>
            <Text style={Styles.quantity}>{quantity}x</Text>
          </View>
          <View style={Styles.titleContainer}>
            <Text style={Styles.title}>{name}</Text>
            {notes &&
              notes.trim() && (
              <Text style={Styles.menuItemNotes}>
                {t('notes.label')}: {notes}
              </Text>
            )}
            {this.renderChoiceItemPrices(orderChoiceItemPrices)}
          </View>
          <View style={DefaultStyles.rowContainer}>
            {paid && <Text style={Styles.paid}>{t('paid.label')}</Text>}
            <Text style={Styles.price}>${totalPrice.toFixed(2)}</Text>
            {showRemove ? (
              <TouchableIcon
                onPress={this.handleRemoveOrderPressed}
                iconName="ios-remove-circle-outline"
                iconType="ionicon"
                iconColor={DefaultColor.iconColor}
                pressColor={DefaultColor.touchableIconPressColor}
                iconDisabledColor={DefaultColor.defaultFontColorDisabled}
                iconContainerStyle={DefaultStyles.iconContainerStyle}
              />
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableItem>
    );
  };
}

OrderItemRow.propTypes = {
  orderItem: OrderItemDetailProp.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
  onOrderSelected: PropTypes.func,
  enableMultiSelection: PropTypes.bool,
  isSelected: PropTypes.bool,
  showRemove: PropTypes.bool,
};

OrderItemRow.defaultProps = {
  enableMultiSelection: false,
  isSelected: false,
  onOrderSelected: null,
  showRemove: true,
};

export default translate()(OrderItemRow);
