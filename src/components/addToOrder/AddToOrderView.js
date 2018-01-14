// @flow

import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import { TouchableItem } from '@microbusiness/common-react-native';
import Styles from './Styles';

class AddToOrderView extends Component {
  render = () => {
    return this.props.isUpdatingOrder ? (
      <TouchableItem onPress={this.props.updateOrderPressed} style={Styles.container}>
        <Text style={Styles.text}>Update Order</Text>
      </TouchableItem>
    ) : (
      <TouchableItem onPress={this.props.addToOrderPressed} style={Styles.container}>
        <Text style={Styles.text}>ADD {this.props.orderQuantity} TO ORDER</Text>
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
