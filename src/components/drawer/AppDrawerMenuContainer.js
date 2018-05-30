// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { DrawerItems, NavigationActions } from 'react-navigation';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import Styles from './Styles';

const AppDrawerMenuContainer = props => (
  <View style={Styles.container}>
    <View style={Styles.menu}>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </View>
  </View>
);

AppDrawerMenuContainer.propTypes = {
  gotoScreen: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  gotoScreen: routeName => dispatch(NavigationActions.navigate({ routeName })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppDrawerMenuContainer);
