// @flow

import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { List, ListItem, Text } from 'react-native-elements';
import Styles from './Styles';
import packageInfo from '../../../package.json';

const Settings = ({ signOut, handleClickPrivacyPolicyLink, handleClickOpenSourceLicensesLink, handleClickTermsAndConditionLink }) => (
  <View>
    <List>
      <ListItem title="Sign out" leftIcon={{ name: 'ios-log-out-outline', type: 'ionicon' }} onPress={signOut} />
    </List>
    <View style={Styles.aboutContainer}>
      <Text>Version {packageInfo.version}</Text>
      <Text>Copyright 2016 - {new Date().getFullYear()} Micro-business Ltd</Text>
      <Text onPress={handleClickPrivacyPolicyLink} style={Styles.hyperLink}>
        Privacy Policy
      </Text>
      <Text onPress={handleClickOpenSourceLicensesLink} style={Styles.hyperLink}>
        Open Source Licenses
      </Text>
      <Text onPress={handleClickTermsAndConditionLink} style={Styles.hyperLink}>
        Terms of Service
      </Text>
    </View>
  </View>
);

Settings.propTypes = {
  signOut: PropTypes.func.isRequired,
  handleClickOpenSourceLicensesLink: PropTypes.func.isRequired,
  handleClickPrivacyPolicyLink: PropTypes.func.isRequired,
  handleClickTermsAndConditionLink: PropTypes.func.isRequired,
};

export default Settings;
