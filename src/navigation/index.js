import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import FlashMessage from 'react-native-flash-message';
import parseDeepLink from '../initialize/DeepLink';

import ModalNavigationStack from './NavigationModalStack';
import TabNavigationStack from './NavigationTabStack';

import SearchScreen from './Modal/SearchScreen';
import PromoScreen from './Modal/PromoScreen';
import LandingScreen from './Modal/LandingScreen/LandingScreen';
import { useStore } from '../store/Context';
import { useEffect, useRef, useState } from 'react';
import PushNotificationEvents from '../initialize/PushNotificationEvents';
import * as Linking from 'expo-linking';
import CatalogScreen from './Catalog/CatalogScreen';
import CatalogViewScreen from './Catalog/CatalogViewScreen';
import ProductScreen from './Modal/ProductScreen';

const StackNavigator = createStackNavigator();

const withHeaderSettings = {
  headerShown: true,
  headerBackTitle: ' ',
  headerTintColor: '#20201F',
  headerStyle: {
    backgroundColor: '#FEFFFE',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const AppNavigation = () => {
  const store = useStore();
  const myLocalFlashMessage = useRef();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (store.app.deeplink) {
      goToDeeplink(store.app.deeplink);
    }
  }, [store.app.deeplinkUpdate]);

  const goToDeeplink = (url, count = 0) => {
    if (count > 100) return;
    if (!navigation.isReady()) return setTimeout(() => goToDeeplink(url, count + 1), 100);
    const { screen, params } = parseDeepLink(url);
    if (screen) {
      navigation.navigate(screen, params);
    }
  };

  return (
    <PushNotificationEvents>
      <StackNavigator.Navigator
        initialRouteName={store.user.showLanding !== 'shown' ? 'LandingScreen' : 'TabNavigation'}
        screenOptions={{ headerShown: false }}
      >
        <StackNavigator.Group>
          <StackNavigator.Screen name="TabNavigation" component={TabNavigationStack} />
        </StackNavigator.Group>
        <StackNavigator.Screen name="ProductScreen" component={ProductScreen} />
        <StackNavigator.Group
          screenOptions={{
            presentation: 'modal',
            gestureEnabled: Platform.OS === 'ios',
            cardOverlayEnabled: true,
            gestureDirection: 'vertical',
            gestureResponseDistance: height * 0.8,
            ...TransitionPresets.ModalPresentationIOS,
            cardStyle: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <StackNavigator.Screen name="ModalNavigation" component={ModalNavigationStack} />
          <StackNavigator.Screen name="PromoScreen" component={PromoScreen} />
        </StackNavigator.Group>
        <StackNavigator.Group
          screenOptions={{
            presentation: 'modal',
            gestureEnabled: Platform.OS === 'ios',
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        >
          <StackNavigator.Screen name="SearchScreen" component={SearchScreen} />
          <StackNavigator.Screen
            name="SearchCatalogView"
            component={CatalogViewScreen}
            options={{ ...withHeaderSettings, headerTitle: ' ' }}
          />
        </StackNavigator.Group>
        <StackNavigator.Screen name="LandingScreen" component={LandingScreen} />
      </StackNavigator.Navigator>
      <FlashMessage ref={myLocalFlashMessage} />
    </PushNotificationEvents>
  );
};

export default observer(AppNavigation);
