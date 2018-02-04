// @flow

import { TouchableItem, TouchableIcon } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { OrderItemProp } from './PropTypes';
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
    const nextOrderItem = Immutable.fromJS(nextProps.orderItem);
    return this.state.orderItem.get('id') === nextOrderItem.get('id');
  };

  componentWillReceiveProps = nextProps => {
    const orderItem = Immutable.fromJS(nextProps.orderItem);

    if (!this.state.orderItem.equals(orderItem)) {
      this.setState({ orderItem });
    }
  };

  render = () => {
    return (
      <TouchableItem onPress={() => this.props.onViewOrderItemPressed(this.props.orderItem.menuItem, this.props.orderItem)}>
        <View style={[DefaultStyles.rowContainer, { padding: 15 }]}>
          <View style={Styles.quantityContainer}>
            <Text style={Styles.quantity}>{this.props.orderItem.quantity}x</Text>
          </View>
          <View style={Styles.titleContainer}>
            <Text style={Styles.title}>{this.props.orderItem.menuItem.name}</Text>
            <Text style={Styles.extraOptions}>Extra 1</Text>
            <Text style={Styles.extraOptions}>Extra 2</Text>
            <Text style={Styles.extraOptions}>Extra 3</Text>
          </View>
          <View style={DefaultStyles.rowContainer}>
            <Text style={Styles.price}>{this.props.orderItem.menuItem.priceToDisplay}</Text>
            <TouchableIcon
              onPress={() => this.props.onRemoveOrderPressed(this.props.orderItem.id)}
              iconName="ios-remove-circle-outline"
              iconType="ionicon"
              iconContainerStyle={DefaultStyles.iconContainerStyle}
            />
          </View>
        </View>
      </TouchableItem>
    );
  };
}

OrderItemRow.propTypes = {
  orderItem: OrderItemProp.isRequired,
  orderQuantity: PropTypes.number.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
};

export default OrderItemRow;
