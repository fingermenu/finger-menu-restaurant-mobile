// @flow

import { NotificationType, UserAccessActionTypes } from '@microbusiness/common-react';
import * as appUpdaterActions from '@microbusiness/common-react/src/appUpdater/Actions';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import * as notificationActions from '@microbusiness/common-react/src/notification/Actions';
import * as netInfoActions from '@microbusiness/common-react-native/src/netInfo/Actions';
import * as userAccessActions from '@microbusiness/common-react/src/userAccess/Actions';
import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import { SignUpSignInContainer } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { bindActionCreators } from 'redux';
import { Alert, BackHandler, Platform } from 'react-native';
import { connect } from 'react-redux';
import CodePush from 'react-native-code-push';
import Config from '../../framework/config';
import { SplashContainer } from '../splash';
import { configureStore } from '../../framework/redux';
import AppDrawer from './AppDrawer';

const AppNavigator = StackNavigator(
  {
    Splash: {
      screen: SplashContainer,
    },
    SignUpSignIn: {
      screen: props => (
        <SignUpSignInContainer
          {...props}
          title="Welcome to Finger Menu"
          titleTextColor="white"
          enableFacebookSignIn={false}
          enableCreateAccount={false}
          termAndConditionUrl={Config.fingerMenuTermAndConditionUrl}
          companyName="FingerMenu Ltd"
          labelTextColor="white"
          inputPlaceholderTextColor="white"
          logoImageUrl={Config.fingerMenuLogoImageUrl}
          backgroundColor="#24232D"
          displayEnvironmentSelector
        />
      ),
    },
    App: {
      screen: AppDrawer,
    },
  },
  {
    headerMode: 'none',
  },
);

const routerInitialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Splash'));
const navigationReducer = (state = routerInitialState, action) => {
  let newState;

  switch (action.type) {
  case UserAccessActionTypes.USER_ACCESS_SIGNOUT_IN_PROGRESS:
    newState = AppNavigator.router.getStateForAction(
      NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'SignUpSignIn' })], key: null }),
      state,
    );

    break;

  case UserAccessActionTypes.USER_ACCESS_GET_CURRENT_USER_SUCCEEDED:
    if (action.payload.get('userExists')) {
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'App' })] }),
        state,
      );
    } else {
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'SignUpSignIn' })], key: null }),
        state,
      );
    }

    break;

  case UserAccessActionTypes.USER_ACCESS_SIGNUP_WITH_USERNAME_AND_PASSWORD_SUCCEEDED:
  case UserAccessActionTypes.USER_ACCESS_SIGNIN_WITH_USERNAME_AND_PASSWORD_SUCCEEDED:
  case UserAccessActionTypes.USER_ACCESS_SIGNIN_WITH_FACEBOOK_SUCCEEDED:
    newState = AppNavigator.router.getStateForAction(
      NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'App' })] }),
      state,
    );

    break;

  default:
    newState = AppNavigator.router.getStateForAction(action, state);

    break;
  }

  return newState || state;
};

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const reactNavigationMiddleware = createReactNavigationReduxMiddleware('root', state => {
  return state.navigation;
});
const addListener = createReduxBoundAddListener('root');

export const reduxStore = configureStore(navigationReducer, reactNavigationMiddleware);

class AppWithNavigationState extends Component {
  state = {};

  componentDidMount = () => {
    const { netInfo, netInfoActions, appUpdaterActions, notificationActions } = this.props;

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        const { navigation, goBack } = this.props;
        const newState = AppNavigator.router.getStateForAction(NavigationActions.back(), navigation);

        if (newState !== navigation) {
          goBack();

          return true;
        }

        return true;
      });
    }

    netInfoActions.refreshState(Map());

    CodePush.sync(
      {
        updateDialog: true,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          appUpdaterActions.succeeded();

          break;

        case CodePush.SyncStatus.UNKNOWN_ERROR:
          if (netInfo.netInfoExists && netInfo.isConnected) {
            notificationActions.add('Failed to update the application', NotificationType.ERROR);
          }

          appUpdaterActions.failed('Failed to update the application');

          break;

        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          appUpdaterActions.downloadingUpdate(0);

          break;

        case CodePush.SyncStatus.INSTALLING_UPDATE:
          appUpdaterActions.installingUpdate();

          break;

        case CodePush.SyncStatus.UP_TO_DATE:
          appUpdaterActions.succeeded();

          break;

        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          appUpdaterActions.checkingForUpdate();

          break;

        case CodePush.SyncStatus.UPDATE_IGNORED:
          appUpdaterActions.succeeded();

          break;

        case CodePush.SyncStatus.SYNC_IN_PROGRESS:
        case CodePush.SyncStatus.AWAITING_USER_ACTION:
          break;

        default:
          break;
        }
      },
      ({ receivedBytes, totalBytes }) => appUpdaterActions.downloadingUpdate((receivedBytes / totalBytes) * 100),
    );
  };

  componentWillUnmount = () => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  };

  static getDerivedStateFromProps = nextProps => {
    nextProps.notifications.keySeq().forEach(notificationId => {
      const notification = nextProps.notifications.get(notificationId);
      const notificationType = notification.get('type');
      const notificationMessage = notification.get('message');

      if (notificationType === NotificationType.ERROR) {
        Alert.alert('Error', notificationMessage);
      } else if (notificationType === NotificationType.WARNING) {
        Alert.alert('Warning', notificationMessage);
      } else if (notificationType === NotificationType.INFO) {
        Alert.alert('Info', notificationMessage);
      } else if (notificationType === NotificationType.SUCCESS) {
        Alert.alert('Success', notificationMessage);
      }

      nextProps.notificationActions.remove(notificationId);
    });

    nextProps.userAccessFailedOperations.keySeq().forEach(operationId => {
      nextProps.notificationActions.add(nextProps.userAccessFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      nextProps.userAccessActions.acknowledgeFailedOperation(Map({ operationId }));
    });

    nextProps.asyncStorageFailedOperations.keySeq().forEach(operationId => {
      nextProps.notificationActions.add(nextProps.asyncStorageFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      nextProps.asyncStorageActions.acknowledgeFailedOperation(Map({ operationId }));
    });

    nextProps.escPosPrinterFailedOperations.keySeq().forEach(operationId => {
      nextProps.notificationActions.add(nextProps.escPosPrinterFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      nextProps.escPosPrinterActions.acknowledgeFailedOperation(Map({ operationId }));
    });

    return null;
  };

  setPopupDialogRef = ref => {
    this.popupDialog = ref;
  };

  render = () => {
    const { dispatch, navigation } = this.props;

    return (
      <AppNavigator
        navigation={{
          dispatch,
          state: navigation,
          addListener,
        }}
      />
    );
  };
}

AppWithNavigationState.propTypes = {
  netInfoActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  appUpdaterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  notificationActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  userAccessActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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

const mapStateToProps = state => ({
  navigation: state.navigation,
  netInfo: state.netInfo.toJS(),
  notifications: state.notification.get('notifications'),
  userAccessFailedOperations: state.userAccess.get('failedOperations'),
  asyncStorageFailedOperations: state.asyncStorage.get('failedOperations'),
  escPosPrinterFailedOperations: state.escPosPrinter.get('failedOperations'),
});

const mapDispatchToProps = dispatch => ({
  netInfoActions: bindActionCreators(netInfoActions, dispatch),
  appUpdaterActions: bindActionCreators(appUpdaterActions, dispatch),
  asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
  dispatch,
  notificationActions: bindActionCreators(notificationActions, dispatch),
  userAccessActions: bindActionCreators(userAccessActions, dispatch),
  escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    withRef: true,
  },
)(AppWithNavigationState);
