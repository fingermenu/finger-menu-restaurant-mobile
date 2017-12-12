// @flow

import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import Styles from './Styles';

const PricingDisclaimer = () => (
  <ScrollView style={Styles.container}>
    <Text h4>{`Pricing Disclaimer\n`}</Text>
    <Text
    >{`\nThe products and pricing information provided on the FingerMenuRestaurant service is provided on a best effort basis and comes without any guarantee of accuracy or correctness.\n`}</Text>
    <Text
    >{`\nThe product and pricing information is provided to us through a variety of sources including directly from retailers and wholesalers, through social networks, promotional flyers, public advertising etc.\n`}</Text>
    <Text
    >{`\nWhilst we have systems and processes in place to verify the information provided, from time to time items or pricing mistakes may slip through.\n`}</Text>
    <Text
    >{`\nBy using the FingerMenuRestaurant service you agree to hold us harmless from any liability or costs you may incur as a result of using the information.  \n`}</Text>
    <Text style={Styles.title}>{`\nIf you do not agree to all of the above statements, please close and uninstall the application.\n\n\n`}</Text>
  </ScrollView>
);

export default PricingDisclaimer;
