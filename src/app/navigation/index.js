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
      screen: props => (
        <SignUpSignInContainer
          {...props}
          title="Welcome to Finger Menu"
          titleTextColor="white"
          enableFacebookSignIn={false}
          enableCreateAccount={false}
          termAndConditionUrl="http://www.fingermenu.co.nz/terms"
          companyName="FingerMenu Ltd"
          labelTextColor="white"
          inputPlaceholderTextColor="white"
          logoImageUrl="https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Ffingermenu-logo-3.png?alt=media&token=f86549d0-54ce-490e-a077-9800cc6b6a79"
          backgroundColor="#24232D"
        />
      ),
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

  componentDidMount = () => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        const newState = AppNavigator.router.getStateForAction(NavigationActions.back(), this.props.navigation);

        if (newState !== this.props.navigation) {
          this.props.goBack();

          return true;
        }

        return true;
      });
    }
  };

  componentWillReceiveProps = nextProps => {
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

      this.props.notificationActions.remove(notificationId);
    });

    nextProps.userAccessFailedOperations.keySeq().forEach(operationId => {
      this.props.notificationActions.add(nextProps.userAccessFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      this.props.userAccessActions.acknowledgeFailedOperation(Map({ operationId }));
    });

    nextProps.asyncStorageFailedOperations.keySeq().forEach(operationId => {
      this.props.notificationActions.add(nextProps.asyncStorageFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      this.props.asyncStorageActions.acknowledgeFailedOperation(Map({ operationId }));
    });

    nextProps.escPosPrinterFailedOperations.keySeq().forEach(operationId => {
      this.props.notificationActions.add(nextProps.escPosPrinterFailedOperations.getIn([operationId, 'errorMessage']), NotificationType.ERROR);
      this.props.escPosPrinterActions.acknowledgeFailedOperation(Map({ operationId }));
    });
  };

  componentWillUnmount = () => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  };

  setPopupDialogRef = ref => {
    this.popupDialog = ref;
  };

  render = () => (
    <View style={{ flex: 1 }}>
      <PopupDialog ref={this.setPopupDialogRef} dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })} width={200} haveOverlay>
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

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    netInfo: state.netInfo.toJS(),
    notifications: state.notification.get('notifications'),
    userAccessFailedOperations: state.userAccess.get('failedOperations'),
    asyncStorageFailedOperations: state.asyncStorage.get('failedOperations'),
    escPosPrinterFailedOperations: state.escPosPrinter.get('failedOperations'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    netInfoActions: bindActionCreators(netInfoActions, dispatch),
    appUpdaterActions: bindActionCreators(appUpdaterActions, dispatch),
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    dispatch,
    notificationActions: bindActionCreators(notificationActions, dispatch),
    userAccessActions: bindActionCreators(userAccessActions, dispatch),
    escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(AppWithNavigationState);
