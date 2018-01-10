// @flow

import React, { Component } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { MenuItemProp } from './PropTypes';
import Styles from './Styles';
import { OrderOptionsContainer } from '../../components/orderOptions';
import { AddToOrderContainer } from '../../components/addToOrder';
import QuantityControl from '../../components/quantityControl/QuantityControl';

class MenuItemView extends Component {
  constructor() {
    super();
    this.state = {
      quantity: 1,
    };
  }

  onQuantityIncrease = () => {
    this.setState({ quantity: this.state.quantity + 1 });
  };

  onQuantityDecrease = () => {
    if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render = () => {
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
          <AddToOrderContainer menuItemId={this.props.menuItem.id} orderQuantity={quantity} />
        </View>
      </View>
    );
  };
}

MenuItemView.propTypes = {
  menuItem: MenuItemProp,
};

export default MenuItemView;
