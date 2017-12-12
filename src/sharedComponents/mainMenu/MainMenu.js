// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { TouchableIcon } from '../../components/touchableIcon';
import Styles from './Styles';

const MainMenu = ({ openDrawer }) => (
  <View style={Styles.container}>
    <TouchableIcon onPress={openDrawer} iconName="ios-menu" iconType="ionicon" iconColor="white" />
  </View>
);

MainMenu.propTypes = {
  openDrawer: PropTypes.func.isRequired,
};

export default MainMenu;
