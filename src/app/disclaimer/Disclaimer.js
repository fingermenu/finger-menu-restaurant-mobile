// @flow

import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import Styles from './Styles';

const Disclaimer = () => (
  <ScrollView style={Styles.container}>
    <Text h4>{`Alpha Testing Programme\n`}</Text>
    <Text style={Styles.title}>{`FingerMenuRestaurant is currently in early alpha testing`}</Text>
    <Text
    >{`\nBy using this app you acknowledge that you understand the application and service is experimental, unstable, can change at any time, and that any data you have provided us may be deleted by FingerMenuRestaurant at any time.\n
Our offering of this application and service is not an agreement that FingerMenuRestaurant will continue to offer this application and service.`}</Text>
    <Text style={Styles.title}>{`\nDisclaimer`}</Text>
    <Text>{`\nBy using this application, you assume all risks and costs incurred in your usage of the application and services.\n
FingerMenuRestaurant is not responsible for, and expressly disclaims all liability for damages of any kind arising out of use, references to, or reliance on the information provided by the application. There is no guarantee that the information provided by this application is correct, complete, and up to date.\n
Information provided by third party companies (and available in this application) do not constitute an endorsement by FingerMenuRestaurant of these parties, their products or their services.`}</Text>
    <Text style={Styles.title}>{`\nIf you do not agree to all of the above statements, please close and uninstall the application.\n\n\n`}</Text>
  </ScrollView>
);

export default Disclaimer;
