// @flow

import { Map } from 'immutable';
import { UserAccessActionTypes } from 'micro-business-parse-server-common-react-native';
import { MessageType } from 'micro-business-common-react';
import * as appUpdaterActions from 'micro-business-common-react/src/appUpdater/Actions';
import * as messageBarActions from 'micro-business-common-react/src/messageBar/Actions';
import * as netInfoActions from 'micro-business-common-react-native/src/netInfo/Actions';
import * as userAccessActions from 'micro-business-parse-server-common-react-native/src/userAccess/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, NavigationActions, StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { Alert, BackHandler, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import CodePush from 'react-native-code-push';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { SplashContainer } from '../splash';
import { SignUpSignInContainer } from '../signUpSignIn';
import { configureStore } from '../../framework/redux';
import AppDrawer from './AppDrawer';
/* import { SignInDisclaimerContainer } from '../disclaimer';*/
import { SignInPricingDisclaimerContainer } from '../pricingDisclaimer';

const AppNavigator = StackNavigator(
  {
    Splash: {
      screen: SplashContainer,
      path: '/',
    },
    /* SignInDisclaimer: {
       *   screen: SignInDisclaimerContainer,
       *   path: '/SignInDisclaimer',
       * },*/
    SignInPricingDisclaimer: {
      screen: SignInPricingDisclaimerContainer,
      path: '/SignInPricingDisclaimer',
    },
    SignUpSignIn: {
      screen: SignUpSignInContainer,
      path: '/SignUpSignIn',
    },
    App: {
      screen: AppDrawer,
      path: '/App',
    },
  },
  {
    headerMode: 'none',
  },
);

const navigationReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case UserAccessActionTypes.USER_ACCESS_SIGNOUT_IN_PROGRESS:
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'SignUpSignIn',
            }),
          ],
          key: null,
        }),
        state,
      );
      break;

    case UserAccessActionTypes.USER_ACCESS_GET_CURRENT_USER_SUCCEEDED:
      if (action.payload.get('userExists')) {
        newState = AppNavigator.router.getStateForAction(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'App',
              }),
            ],
          }),
          state,
        );
      } else {
        newState = AppNavigator.router.getStateForAction(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'SignInPricingDisclaimer',
              }),
            ],
            key: null,
          }),
          state,
        );
      }
      break;

    case UserAccessActionTypes.USER_ACCESS_SIGNUP_WITH_USERNAME_AND_PASSWORD_SUCCEEDED:
    case UserAccessActionTypes.USER_ACCESS_SIGNIN_WITH_USERNAME_AND_PASSWORD_SUCCEEDED:
    case UserAccessActionTypes.USER_ACCESS_SIGNIN_WITH_FACEBOOK_SUCCEEDED:
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'App',
            }),
          ],
        }),
        state,
      );
      break;

    default:
      newState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return newState || state;
};

export const reduxStore = configureStore(navigationReducer);

class AppWithNavigationState extends Component {
  componentDidMount = () => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        const newState = AppNavigator.router.getStateForAction(NavigationActions.back(), this.props.navigation);

        if (newState !== this.props.navigation) {
          this.props.goBack();

          return true;
        }

        return false;
      });
    }
  };

  componentWillMount() {
    this.props.netInfoActions.refreshState(Map());

    CodePush.sync(
      {
        updateDialog: true,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            this.props.appUpdaterActions.succeeded();

            break;

          case CodePush.SyncStatus.UNKNOWN_ERROR:
            if (this.props.netInfo.netInfoExists && this.props.netInfo.isConnected) {
              this.props.messageBarActions.add('Failed to update the application', MessageType.ERROR);
            }

            this.props.appUpdaterActions.failed('Failed to update the application');

            break;

          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.props.appUpdaterActions.downloadingUpdate(0);

            break;

          case CodePush.SyncStatus.INSTALLING_UPDATE:
            this.props.appUpdaterActions.installingUpdate();

            break;

          case CodePush.SyncStatus.UP_TO_DATE:
            this.props.appUpdaterActions.succeeded();

            break;

          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            this.props.appUpdaterActions.checkingForUpdate();

            break;

          case CodePush.SyncStatus.UPDATE_IGNORED:
            this.props.appUpdaterActions.succeeded();

            break;

          case CodePush.SyncStatus.SYNC_IN_PROGRESS:
          case CodePush.SyncStatus.AWAITING_USER_ACTION:
            break;

          default:
            break;
        }
      },
      ({ receivedBytes, totalBytes }) => this.props.appUpdaterActions.downloadingUpdate(receivedBytes / totalBytes * 100),
    );
  }

  componentWillUnmount = () => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  };

  componentWillReceiveProps = nextProps => {
    nextProps.messagesInfo.forEach(messageInfo => {
      if (messageInfo.messageType === MessageType.ERROR) {
        Alert.alert('Error', messageInfo.message);
      }
    });

    nextProps.messagesInfo.forEach(messageInfo => this.props.messageBarActions.remove(messageInfo.messageId));

    nextProps.userAccessFailedOperations.forEach(failedOperation => {
      this.props.messageBarActions.add(failedOperation.errorMessage, MessageType.ERROR);

      this.props.userAccessActions.acknowledgeFailedOperation(
        Map({
          operationId: failedOperation.operationId,
        }),
      );
    });
  };

  render = () => (
    <View style={{ flex: 1 }}>
      <PopupDialog
        ref={popupDialog => {
          this.popupDialog = popupDialog;
        }}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        width={200}
        haveOverlay={true}
      >
        <View />
      </PopupDialog>
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigation,
        })}
      />
    </View>
  );
}

AppWithNavigationState.propTypes = {
  netInfoActions: PropTypes.object.isRequired,
  appUpdaterActions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  messageBarActions: PropTypes.object.isRequired,
  userAccessActions: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  netInfo: PropTypes.shape({
    netInfoExists: PropTypes.bool.isRequired,
    connectionInfo: PropTypes.shape({
      type: PropTypes.string.isRequired,
      effectiveType: PropTypes.string.isRequired,
    }),
    isConnectionExpensive: PropTypes.bool,
    isConnected: PropTypes.bool,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    netInfo: state.netInfo.toJS(),
    messagesInfo: state.messageBar.get('messages').toJS(),
    userAccessFailedOperations: state.userAccess.get('failedOperations').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    netInfoActions: bindActionCreators(netInfoActions, dispatch),
    appUpdaterActions: bindActionCreators(appUpdaterActions, dispatch),
    dispatch,
    messageBarActions: bindActionCreators(messageBarActions, dispatch),
    userAccessActions: bindActionCreators(userAccessActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(AppWithNavigationState);
