// @flow

import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Styles from './Styles';

const Account = ({ t, navigateToPin }) => (
  <View style={Styles.waitressMode}>
    <Button title={t('waitressMode.button')} onPress={navigateToPin} />
  </View>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  navigateToPin: () => dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Pin' })] })),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Account));
