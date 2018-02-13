// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Styles';

const AddToOrderView = props =>
  props.isUpdatingOrder ? (
    <TouchableItem onPress={props.handleSubmit(props.updateOrderPressed)} style={Styles.container}>
      <Text style={Styles.text}>Update Order</Text>
    </TouchableItem>
  ) : (
    <TouchableItem onPress={props.handleSubmit(props.addToOrderPressed)} style={Styles.container}>
      <Text style={Styles.text}>ADD {props.orderQuantity} TO ORDER</Text>
    </TouchableItem>
  );

AddToOrderView.propTypes = {
  addToOrderPressed: PropTypes.func.isRequired,
  updateOrderPressed: PropTypes.func.isRequired,
  orderQuantity: PropTypes.number.isRequired,
  isUpdatingOrder: PropTypes.bool.isRequired,
};

export default AddToOrderView;
