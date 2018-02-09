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
    const { quantity } = this.state;
    const { handleSubmit } = this.props;

    return (
      <View style={Styles.container}>
        <ScrollView>
          <View style={Styles.imageContainer}>
            {this.props.menuItemPrice.menuItem.imageUrl ? (
              <Image
                style={Styles.image}
                source={{
                  uri: this.props.menuItemPrice.menuItem.imageUrl,
                }}
              />
            ) : (
              <View />
            )}
          </View>
          <View style={Styles.descriptionContainer}>
            <Text style={Styles.title}>{this.props.menuItemPrice.menuItem.name}</Text>
            <Text style={Styles.description}>{this.props.menuItemPrice.menuItem.description}</Text>
          </View>
          <View style={Styles.optionsContainer}>
            <ChoiceItemsContainer
              choiceItemPrices={this.props.menuItemPrice.choiceItemPrices}
              onChoiceItemPricesSelectionChanged={value => this.onChoiceItemPricesSelectionChanged(value)}
            />
          </View>
        </ScrollView>
        <View>
          <View style={Styles.quantity}>
            <QuantityControl quantity={quantity} onQuantityIncrease={this.onQuantityIncrease} onQuantityDecrease={this.onQuantityDecrease} />
          </View>
          <AddToOrderContainer
            orderItemId={this.props.orderItemId}
            menuItemPrice={this.props.menuItemPrice}
            orderQuantity={quantity}
            handleSubmit={handleSubmit}
          />
        </View>
      </View>
    );
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
