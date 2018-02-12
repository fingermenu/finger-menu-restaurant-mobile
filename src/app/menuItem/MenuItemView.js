// @flow

import React, { Component } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { MenuItemPriceProp } from './PropTypes';
import Styles from './Styles';
import { ChoiceItemsContainer } from '../../components/choiceItems';
import { AddToOrderContainer } from '../../components/addToOrder';
import QuantityControl from '../../components/quantityControl/QuantityControl';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

class MenuItemView extends Component {
  state = {
    quantity: 1,
  };

  componentWillMount = () => {
    if (this.props.order) {
      this.setState({ quantity: this.props.order.quantity });
    }
  };

  render = () => {
    const { quantity } = this.state;
    const { handleSubmit, menuItemPrice: { menuItem: { name, description, imageUrl }, choiceItemPrices }, orderItemId, menuItemPrice } = this.props;

    return (
      <View style={Styles.container}>
        <ScrollView>
          <View style={Styles.imageContainer}>{imageUrl ? <Image style={Styles.image} source={{ uri: imageUrl }} /> : <View />}</View>
          <View style={Styles.descriptionContainer}>
            <Text style={Styles.title}>{name}</Text>
            <Text style={Styles.description}>{description}</Text>
          </View>
          <View style={Styles.optionsContainer}>
            <ChoiceItemsContainer choiceItemPrices={choiceItemPrices} />
          </View>
        </ScrollView>
        <View>
          <View style={Styles.quantity}>
            <QuantityControl quantity={quantity} onQuantityIncrease={this.onQuantityIncrease} onQuantityDecrease={this.onQuantityDecrease} />
          </View>
          <AddToOrderContainer orderItemId={orderItemId} menuItemPrice={menuItemPrice} orderQuantity={quantity} handleSubmit={handleSubmit} />
        </View>
      </View>
    );
  };

  onQuantityIncrease = () => {
    this.setState({ quantity: this.state.quantity + 1 });
  };

  onQuantityDecrease = () => {
    if (this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };
}

MenuItemView.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  order: PropTypes.object,
  orderItemId: PropTypes.string,
};

function mapStateToProps(state, props) {
  const initialValues = {};
  if (props.order) {
    props.order.orderChoiceItemPrices.forEach(ocp => {
      initialValues[ocp.choiceItemPriceId] = true;
    });
  }

  // Set the initial values of orderChoiceItems when viewing an existing order.
  return {
    initialValues,
  };
}

// export default MenuItemView;
export default connect(mapStateToProps)(reduxForm({ form: 'menuItem', enableReinitialize: true })(MenuItemView));
