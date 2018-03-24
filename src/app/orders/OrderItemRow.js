// @flow

import { TouchableItem, TouchableIcon } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';
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

  onViewOrderItemPressed = () =>
    this.onViewOrderItemPressedDebounced(this.props.orderItem.menuItemPriceId, this.props.orderItem, this.props.orderItemId);

  onRemoveOrderPressed = () => {
    this.props.onRemoveOrderPressed(this.props.orderItemId);
  };

  handleOrderItemSelected = () => {
    if (this.props.onOrderSelected) {
      this.props.onOrderSelected(this.props.orderItem, !this.props.isSelected);
    }
  };

  renderChoiceItems = choiceItems =>
    choiceItems.map(choiceItem => (
      <Text key={choiceItem.choiceItemPriceId} style={Styles.extraOptions}>
        {choiceItem.choiceItemPrice.choiceItem.name} -{' '}
        {choiceItem.choiceItemPrice.currentPrice ? '$' + choiceItem.choiceItemPrice.currentPrice.toFixed(2) : ''}
      </Text>
    ));

  render = () => {
    return (
      <TouchableItem onPress={this.onViewOrderItemPressed}>
        <View style={[DefaultStyles.rowContainer, Styles.orderRowContainer]}>
          {this.props.enableMultiSelection ? (
            !this.props.isPaid ? (
              <CheckBox
                center
                size={28}
                iconType="material-community"
                checkedIcon="check-circle-outline"
                uncheckedIcon="checkbox-blank-circle-outline"
                checked={this.props.isSelected}
                onPress={this.handleOrderItemSelected}
              />
            ) : (
              <View />
            )
          ) : (
            <View />
          )}
          <View style={Styles.quantityContainer}>
            <Text style={Styles.quantity}>{this.props.orderItem.quantity}x</Text>
          </View>
          <View style={Styles.titleContainer}>
            <Text style={Styles.title}>{this.props.menuItem.name}</Text>
            {this.props.orderItem.notes &&
              this.props.orderItem.notes.trim().length > 0 && <Text style={Styles.menuItemNotes}>Notes: {this.props.orderItem.notes}</Text>}
            {this.renderChoiceItems(this.props.orderItem.orderChoiceItemPrices)}
          </View>
          <View style={DefaultStyles.rowContainer}>
            {this.props.isPaid ? <Text style={Styles.paid}>Paid</Text> : <View />}
            <Text style={Styles.price}>${this.props.menuItemCurrentPrice.toFixed(2)}</Text>
            {this.props.showRemove ? (
              <TouchableIcon
                onPress={this.onRemoveOrderPressed}
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
  orderItemId: PropTypes.string.isRequired,
  menuItem: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  menuItemCurrentPrice: PropTypes.number.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
  enableMultiSelection: PropTypes.bool,
  isSelected: PropTypes.bool,
  onOrderSelected: PropTypes.func,
  showRemove: PropTypes.bool,
};

OrderItemRow.defaultProps = {
  enableMultiSelection: false,
  isSelected: false,
  onOrderSelected: null,
  showRemove: true,
};

export default OrderItemRow;
