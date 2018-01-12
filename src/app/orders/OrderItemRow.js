// @flow

import { TouchableItem, TouchableIcon } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { MenuItemProp } from './PropTypes';
import config from '../../framework/config';
import Styles from './Styles';
import { DefaultStyles } from '../../style';

class OrderItemRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.onViewOrderItemPressed = debounce(this.props.onViewOrderItemPressed, config.navigationDelay);

    this.state = { orderItem: Immutable.fromJS(props.orderItem) };
  }

  shouldComponentUpdate = nextProps => {
    return this.state.orderItem.equals(Immutable.fromJS(nextProps.orderItem));
  };

  componentWillReceiveProps = nextProps => {
    const orderItem = Immutable.fromJS(nextProps.orderItem);

    if (!this.state.orderItem.equals(orderItem)) {
      this.setState({ orderItem });
    }
  };

  render = () => {
    return (
      <TouchableItem onPress={() => this.props.onViewOrderItemPressed(this.props.orderItem.menuItem)}>
        <View style={Styles.rowContainer}>
          <View style={Styles.rowTextContainer}>
            <Text>{this.props.orderItem.quantity}x</Text>
            <Text style={Styles.title}>{this.props.orderItem.menuItem.name}</Text>
            <Text style={Styles.price}>{this.props.orderItem.menuItem.priceToDisplay}</Text>
            <TouchableIcon iconName="ios-trash-outline" iconType="ionicon" iconContainerStyle={DefaultStyles.iconContainerStyle} />
          </View>
        </View>
      </TouchableItem>
    );
  };
}

OrderItemRow.propTypes = {
  menuItem: MenuItemProp,
  orderQuantity: PropTypes.number.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
};

export default OrderItemRow;
