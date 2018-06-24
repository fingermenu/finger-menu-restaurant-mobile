// @flow

import * as userAccessActions from '@microbusiness/common-react/src/userAccess/Actions';
import { TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DrawerItems, StackActions, SafeAreaView, NavigationActions } from 'react-navigation';
import { AsyncStorage, ScrollView, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Styles from './Styles';
import PackageBundleHelper from '../../framework/PackageBundleHelper';

class AppDrawerMenuContainer extends Component {
  cleanDevice = async () => {
    await PackageBundleHelper.cleanAllData();

    const { userAccessActions } = this.props;

    userAccessActions.signOut();
  };

  handleSignOut = () => {
    AsyncStorage.clear(() => {
      this.cleanDevice();
    });
  };

  render = () => {
    const { t, lockScreen } = this.props;

    return (
      <ScrollView>
        <SafeAreaView style={Styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...this.props} />
          <TouchableItem key="lockScreen" onPress={lockScreen} delayPressIn={0}>
            <SafeAreaView forceInset={{ vertical: 'never' }}>
              <View style={Styles.item}>
                <View style={Styles.icon}>
                  <Icon name="lock" type="material-community" />
                </View>
                <Text style={Styles.label}>
                  {t('lockScreen.label')}
                </Text>
              </View>
            </SafeAreaView>
          </TouchableItem>
          <TouchableItem key="signout" onPress={this.handleSignOut} delayPressIn={0}>
            <SafeAreaView forceInset={{ vertical: 'never' }}>
              <View style={Styles.item}>
                <View style={Styles.icon}>
                  <Icon name="logout" type="material-community" />
                </View>
                <Text style={Styles.label}>
                  {t('signOut.label')}
                </Text>
              </View>
            </SafeAreaView>
          </TouchableItem>
        </SafeAreaView>
        <View />
      </ScrollView>
    );
  };
}

AppDrawerMenuContainer.propTypes = {
  userAccessActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  lockScreen: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  userAccessActions: bindActionCreators(userAccessActions, dispatch),
  lockScreen: () => dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Pin' })] })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(AppDrawerMenuContainer));
