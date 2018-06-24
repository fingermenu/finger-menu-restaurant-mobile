// @flow

import { LoadingInProgress } from '@microbusiness/common-react-native';
import { configParseServerSdk, ConfigReader } from '@microbusiness/parse-server-common-react-native';
import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import RNRestart from 'react-native-restart';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import { I18nextProvider } from 'react-i18next';
import { MenuProvider } from 'react-native-popup-menu';
import Navigation, { reduxStore } from './app/navigation';
import i18n from './i18n';

const errorHandler = (e, isFatal) => {
  Alert.alert(
    'Unexpected error occurred',
    `
        Error: ${isFatal ? 'Fatal:' : ''} ${e.name} - ${e.message}

        We will need to restart the app.
        `,
    [
      {
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        },
      },
    ],
  );
};

setJSExceptionHandler(errorHandler);

export default class FingerMenuRestaurant extends Component {
  constructor(props, context) {
    super(props, context);

    AsyncStorage.getItem('@global:environment')
      .then(environment => {
        const parseServerConfigReader = new ConfigReader(environment ? environment : ConfigReader.getDefaultEnvironment());

        configParseServerSdk(
          parseServerConfigReader.getParseServerUrl(),
          parseServerConfigReader.getParseServerApplicationId(),
          parseServerConfigReader.getParseServerJavascriptKey(),
        );
        this.setState({ isLoading: false });
      })
      .catch(error => {
        Alert.alert(error.message);

        const parseServerConfigReader = new ConfigReader();

        configParseServerSdk(
          parseServerConfigReader.getParseServerUrl(),
          parseServerConfigReader.getParseServerApplicationId(),
          parseServerConfigReader.getParseServerJavascriptKey(),
        );
        this.setState({ isLoading: false });
      });

    this.state = {
      store: reduxStore,
      isLoading: true,
    };
  }

  render = () => {
    const { isLoading, store } = this.state;

    if (isLoading) {
      return <LoadingInProgress />;
    }

    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MenuProvider>
            <Navigation />
          </MenuProvider>
        </Provider>
      </I18nextProvider>
    );
  };
}
