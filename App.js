import './wdyr';
import './src/initialize/IgnoreError';
import 'react-native-get-random-values';
import 'intl';
import 'intl/locale-data/jsonp/ru';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext';
import SplashScreen from './src/component/SplashScreen';
import Styled from './src/initialize/Styled';
import AppNavigation from './src/navigation';
import { StoreProvider } from './src/store/Context';
import store from './src/store/Store';
import { StatusBar } from 'expo-status-bar';
import { InitExternalServices } from './src/initialize/ExternalServices';
import { Text } from 'react-native';
import * as Linking from 'expo-linking';
import * as Sentry from 'sentry-expo';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

dayjs.extend(customParseFormat);
dayjs.locale(ru);

InitExternalServices();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const prefix = Linking.createURL('/');

const App = () => {
  const linking = {
    prefixes: [prefix],

    async getInitialURL() {
      const url = await Linking.getInitialURL();
      store.app.setDeeplink(url);
      return url;
    },

    subscribe(listener) {
      const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
        store.app.setDeeplink(url);
      });
      return () => {
        linkingSubscription.remove();
      };
    },
  };

  if (store.app.status !== 'idle') {
    return (
      <StoreProvider store={store}>
        <SplashScreen />
      </StoreProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider store={store}>
        <StatusBar style="light" />
        <Styled>
          <SafeAreaProvider>
            <ActionSheetProvider>
              <NavigationContainer linking={linking} theme={{ colors: { background: '#FEFEFE' } }}>
                <AppNavigation />
              </NavigationContainer>
            </ActionSheetProvider>
          </SafeAreaProvider>
        </Styled>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default observer(App);
