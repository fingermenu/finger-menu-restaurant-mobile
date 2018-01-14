// @flow

import React, { Component } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { MenuItemProp } from './PropTypes';
import Styles from './Styles';
import { OrderOptionsContainer } from '../../components/orderOptions';
import { AddToOrderContainer } from '../../components/addToOrder';
import QuantityControl from '../../components/quantityControl/QuantityControl';
import { OrderItemPropOptional } from '../orders/PropTypes';

class MenuItemView extends Component {
  constructor() {
    super();
    this.state = {
      quantity: 1,
    };
  }

  componentWillMount = () => {
    if (this.props.order) {
      this.setState({ quantity: this.props.order.quantity });
    }
  };

  onQuantityIncrease = () => {
    this.setState({ quantity: this.state.quantity + 1 });
  };

  onQuantityDecrease = () => {
    if (this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render = () => {
    // if (this.props.order){
    //   this.setState({quantity: this.props.order.quantity});
    // }

    const { quantity } = this.state;

    return (
      <View style={Styles.container}>
        <ScrollView>
          <View style={Styles.imageContainer}>
            <Image
              style={Styles.image}
              source={{
                uri: this.props.menuItem.imageUrl,
              }}
            />
          </View>
          <View style={Styles.descriptionContainer}>
            <Text style={Styles.title}>{this.props.menuItem.name}</Text>
            <Text style={Styles.description}>{this.props.menuItem.description}</Text>
          </View>
          <View style={Styles.optionsContainer}>
            <OrderOptionsContainer orderOptions={this.props.menuItem.orderOptions} />
          </View>
          <View style={Styles.quantity}>
            <QuantityControl quantity={quantity} onQuantityIncrease={this.onQuantityIncrease} onQuantityDecrease={this.onQuantityDecrease} />
          </View>
        </ScrollView>
        <View>
          <AddToOrderContainer order={this.props.order} menuItem={this.props.menuItem} orderQuantity={quantity} />
        </View>
      </View>
    );
  };
}

MenuItemView.propTypes = {
  menuItem: MenuItemProp,
  order: OrderItemPropOptional,
};

export default MenuItemView;
