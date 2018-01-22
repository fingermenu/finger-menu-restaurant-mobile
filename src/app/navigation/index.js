// @flow

import { UserAccessActionTypes } from '@microbusiness/common-react';
import { NotificationType } from '@microbusiness/common-react';
import * as appUpdaterActions from '@microbusiness/common-react/src/appUpdater/Actions';
import * as notificationActions from '@microbusiness/common-react/src/notification/Actions';
import * as netInfoActions from '@microbusiness/common-react-native/src/netInfo/Actions';
import * as userAccessActions from '@microbusiness/common-react/src/userAccess/Actions';
import { SignUpSignInContainer } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, NavigationActions, StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { Alert, BackHandler, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import CodePush from 'react-native-code-push';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { SplashContainer } from '../splash';
import AppNavigationStack from './AppNavigationStack';
import { configureStore } from '../../framework/redux';

const AppNavigator = StackNavigator(
  {
    Splash: {
      screen: SplashContainer,
      path: '/',
    },
    SignUpSignIn: {
      screen: props => <SignUpSignInContainer {...props} title="Finger Menu" />,
      path: '/SignUpSignIn',
    },
    App: {
      screen: AppNavigationStack,
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
                routeName: 'SignUpSignIn',
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
              this.props.notificationActions.add('Failed to update the application', NotificationType.ERROR);
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
    nextProps.notifications.forEach(notification => {
      if (notification.get('type') === NotificationType.ERROR) {
        Alert.alert('Error', notification.get('message'));
      } else if (notification.get('type') === NotificationType.WARNING) {
        Alert.alert('Warning', notification.get('message'));
      } else if (notification.get('type') === NotificationType.INFO) {
        Alert.alert('Info', notification.get('message'));
      } else if (notification.get('type') === NotificationType.SUCCESS) {
        Alert.alert('Success', notification.get('message'));
      }

      this.props.notificationActions.remove(notification.get('id'));
    });

    nextProps.userAccessFailedOperations.keySeq().forEach(operationId => {
      this.props.notificationActions.add(nextProps.userAccessFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      this.props.userAccessActions.acknowledgeFailedOperation(Map({ operationId }));
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
  notificationActions: PropTypes.object.isRequired,
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
    notifications: state.notification.get('notifications'),
    userAccessFailedOperations: state.userAccess.get('failedOperations'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    netInfoActions: bindActionCreators(netInfoActions, dispatch),
    appUpdaterActions: bindActionCreators(appUpdaterActions, dispatch),
    dispatch,
    notificationActions: bindActionCreators(notificationActions, dispatch),
    userAccessActions: bindActionCreators(userAccessActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(AppWithNavigationState);
