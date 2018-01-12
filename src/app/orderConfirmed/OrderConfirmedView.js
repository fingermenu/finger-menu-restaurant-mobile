// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

const OrderConfirmedView = ({ onAddMoreOrdersPressed }) => {
  return (
    <View>
      <Text>Thank you, your order has been placed!</Text>
      <Button title="Oops, I need to add more orders" onPress={onAddMoreOrdersPressed} />
    </View>
  );
};

export default OrderConfirmedView;
