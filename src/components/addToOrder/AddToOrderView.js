// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';

class AddToOrderView extends Component {
  onUpdateOrder = () => {
    this.props.handleSubmit(this.props.updateOrderPressed);
  };

  onAddOrder = () => {
    this.props.handleSubmit(this.props.addToOrderPressed);
  };

  render = () => {
    const { isUpdatingOrder, orderQuantity } = this.props;

    return isUpdatingOrder ? (
      <TouchableItem onPress={this.onUpdateOrder} style={Styles.container}>
        <Text style={Styles.text}>Update Order</Text>
      </TouchableItem>
    ) : (
      <TouchableItem onPress={this.onAddOrder} style={Styles.container}>
        <Text style={Styles.text}>ADD {orderQuantity} TO ORDER</Text>
      </TouchableItem>
    );
  };
}

AddToOrderView.propTypes = {
  addToOrderPressed: PropTypes.func.isRequired,
  updateOrderPressed: PropTypes.func.isRequired,
  orderQuantity: PropTypes.number.isRequired,
  isUpdatingOrder: PropTypes.bool.isRequired,
};

export default AddToOrderView;
