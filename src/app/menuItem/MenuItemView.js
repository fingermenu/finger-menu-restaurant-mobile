// @flow

import React, { Component } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { MenuItemProp } from './PropTypes';
import Styles from './Styles';
import { OrderOptionsContainer } from '../../components/orderOptions';

class MenuItemView extends Component {
  render = () => {
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
        </ScrollView>
        <View>
          <Text>Checkout button</Text>
        </View>
      </View>
    );
  };
}

MenuItemView.propTypes = {
  menuItem: MenuItemProp,
};

export default MenuItemView;
