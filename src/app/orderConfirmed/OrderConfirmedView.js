// @flow

import React from 'react';
import { ImageBackground, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Styles from './Styles';

const OrderConfirmedView = ({ onAddMoreOrdersPressed }) => {
  return (
    <ImageBackground
      style={Styles.container}
      source={{
        uri:
          'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Fcover.jpg?alt=media&token=0a3f9bc2-1d2d-48c4-9f32-8b2207c1c76b',
      }}
    >
      <Text style={Styles.text}>
        Thank you! The kitchen staff have received your order and are now busy crafting your culinary delights. The waiting staff will collect your
        tablet shortly.
      </Text>
      <Button title="A hidden button is coming..." onPress={onAddMoreOrdersPressed} />
    </ImageBackground>
  );
};

export default OrderConfirmedView;
