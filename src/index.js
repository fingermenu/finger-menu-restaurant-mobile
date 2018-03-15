// @flow

import { configParseServerSdk, ConfigReader } from '@microbusiness/parse-server-common-react-native';
import React, { Component } from 'react';
import { Alert } from 'react-native';
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

    const configReader = new ConfigReader();

    configParseServerSdk(configReader.getParseServerUrl(), configReader.getParseServerApplicationId(), configReader.getParseServerJavascriptKey());

    this.state = {
      store: reduxStore,
    };
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={this.state.store}>
          <MenuProvider>
            <Navigation />
          </MenuProvider>
        </Provider>
      </I18nextProvider>
    );
  }
}
