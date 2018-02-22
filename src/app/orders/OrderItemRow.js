// @flow

import { TouchableItem, TouchableIcon } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Text } from 'react-native';
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
    // this.props.popupDialog.show();
    //this.props.onRemoveOrderPressed(this.props.orderItemId);
  };

  renderChoiceItems = choiceItems =>
    choiceItems.map(choiceItem => (
      <Text key={choiceItem.choiceItemPriceId} style={Styles.extraOptions}>
        {choiceItem.choiceItemPrice.choiceItem.name} ({choiceItem.choiceItemPrice.currentPrice})
      </Text>
    ));

  render = () => {
    return (
      <TouchableItem onPress={this.onViewOrderItemPressed}>
        <View style={[DefaultStyles.rowContainer, Styles.orderRowContainer]}>
          <View style={Styles.quantityContainer}>
            <Text style={Styles.quantity}>{this.props.orderItem.quantity}x</Text>
          </View>
          <View style={Styles.titleContainer}>
            <Text style={Styles.title}>{this.props.menuItem.name}</Text>
            {this.renderChoiceItems(this.props.orderItem.orderChoiceItemPrices)}
          </View>
          <View style={DefaultStyles.rowContainer}>
            <Text style={Styles.price}>${this.props.menuItemCurrentPrice}</Text>
            <TouchableIcon
              onPress={this.onRemoveOrderPressed}
              iconName="ios-remove-circle-outline"
              iconType="ionicon"
              iconColor={DefaultColor.iconColor}
              pressColor={DefaultColor.touchableIconPressColor}
              iconDisabledColor={DefaultColor.defaultFontColorDisabled}
              iconContainerStyle={DefaultStyles.iconContainerStyle}
            />
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
};

export default OrderItemRow;
