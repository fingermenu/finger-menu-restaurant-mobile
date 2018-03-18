// @flow

import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { MenuItemPriceProp } from './PropTypes';
import Styles from './Styles';
import { ChoiceItemsContainer } from '../../components/choiceItems';
import { AddToOrderContainer } from '../../components/addToOrder';
import QuantityControl from '../../components/quantityControl/QuantityControl';
import { DefaultStyles } from '../../style';

class MenuItemView extends Component {
  state = {
    quantity: 1,
  };

  componentDidMount = () => {
    if (this.props.order) {
      this.setState({ quantity: this.props.order.quantity });
    }
  };

  handleQuantityIncrease = () => {
    this.setState({ quantity: this.state.quantity + 1 });
  };

  handleQuantityDecrease = () => {
    if (this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render = () => {
    const { quantity } = this.state;
    const { handleSubmit, menuItemPrice: { menuItem: { name, description, imageUrl }, choiceItemPrices }, orderItemId, menuItemPrice } = this.props;

    return (
      <View style={Styles.container}>
        <ScrollView>
          <View style={Styles.imageContainer}>{imageUrl ? <FastImage style={Styles.image} source={{ uri: imageUrl }} /> : <View />}</View>
          <View style={Styles.descriptionContainer}>
            <View style={Styles.nameContainer}>
              <Text style={DefaultStyles.primaryTitleFont}>{name}</Text>
              <Text style={Styles.price}>${menuItemPrice.currentPrice}</Text>
            </View>
            <Text style={Styles.description}>{description}</Text>
          </View>
          <View style={Styles.optionsContainer}>
            <ChoiceItemsContainer choiceItemPrices={choiceItemPrices} />
          </View>
        </ScrollView>
        <View>
          <View style={Styles.quantityContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>Quantity</Text>
            <QuantityControl quantity={quantity} onQuantityIncrease={this.handleQuantityIncrease} onQuantityDecrease={this.handleQuantityDecrease} />
          </View>
          <AddToOrderContainer orderItemId={orderItemId} menuItemPrice={menuItemPrice} orderQuantity={quantity} handleSubmit={handleSubmit} />
        </View>
      </View>
    );
  };
}

MenuItemView.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  order: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  orderItemId: PropTypes.string,
};

MenuItemView.defaultProps = {
  order: null,
  orderItemId: null,
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
