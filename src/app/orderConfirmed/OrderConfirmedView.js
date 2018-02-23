// @flow

import React from 'react';
import { Text, Image, View } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import Styles from './Styles';

const OrderConfirmedView = ({ onAddMoreOrdersPressed }) => {
  return (
    <View style={Styles.container}>
      <Image
        style={Styles.topLogo}
        source={{
          uri:
            'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Flogo.png?alt=media&token=8276c172-5f83-43b1-9a3f-f734138325f9',
        }}
      />
      <Text style={Styles.text}>
        Thank you! The kitchen staff have received your order and are now busy crafting your culinary delights. The waiting staff will collect your
        tablet shortly.
      </Text>
      <TouchableItem onPress={onAddMoreOrdersPressed}>
        <Image
          style={Styles.image}
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Ffingermenu-logo-3.png?alt=media&token=f86549d0-54ce-490e-a077-9800cc6b6a79',
          }}
        />
      </TouchableItem>
    </View>
  );
};

export default OrderConfirmedView;
