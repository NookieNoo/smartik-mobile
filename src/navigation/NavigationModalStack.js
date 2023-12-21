import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import OrderCreateScreen from './Modal/OrderCreateScreen';
import OrderPayScreen from './Modal/OrderPayScreen';
import AddressLocationScreen from './Modal/AddressLocationScreen';
import OrderScreen from './Modal/OrderScreen';
import PromocodeScreen from './Modal/PromocodeScreen';
import AddressInputScreen from './Modal/AddressInputScreen';
import LoginPhoneScreen from './Modal/LoginPhoneScreen';
import LoginCodeScreen from './Modal/LoginCodeScreen';
import StoriesScreen from './Modal/StoriesScreen';
import PromoScreen from './Modal/PromoScreen';

const ModalStack = createStackNavigator();

const headerSettings = {
  headerBackTitle: ' ',
  headerBackTitleStyle: { color: '#007AFF' },
  headerTintColor: '#20201F',
  headerStyle: {
    backgroundColor: '#FEFFFE',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const ModalNavigationStack = () => {
  return (
    <ModalStack.Navigator>
      <ModalStack.Screen
        name="OrderCreateScreen"
        options={{ ...headerSettings, headerTitle: 'Оформление заказа' }}
        component={OrderCreateScreen}
      />
      <ModalStack.Screen
        name="OrderPayScreen"
        options={{ headerShown: false }}
        component={OrderPayScreen}
      />
      <ModalStack.Screen
        name="AddressLocationScreen"
        options={{ headerShown: false }}
        component={AddressLocationScreen}
      />
      <ModalStack.Screen
        name="AddressInputScreen"
        options={{ ...headerSettings, headerTitle: 'Уточните адрес' }}
        component={AddressInputScreen}
      />
      <ModalStack.Screen
        name="OrderScreen"
        options={{ headerShown: false }}
        component={OrderScreen}
      />
      <ModalStack.Screen
        name="PromocodeScreen"
        options={{ ...headerSettings, headerTitle: 'Введите промокод' }}
        component={PromocodeScreen}
      />
      <ModalStack.Screen
        name="LoginPhoneScreen"
        options={{ ...headerSettings, headerTitle: 'Авторизация' }}
        component={LoginPhoneScreen}
      />
      <ModalStack.Screen
        name="LoginCodeScreen"
        options={{ ...headerSettings, headerTitle: 'Авторизация' }}
        component={LoginCodeScreen}
      />
      <ModalStack.Screen
        name="PromoScreen"
        options={{ headerShown: false }}
        component={PromoScreen}
      />
      <ModalStack.Screen
        name="StoriesScreen"
        options={{ headerShown: false }}
        component={StoriesScreen}
      />
    </ModalStack.Navigator>
  );
};

export default observer(ModalNavigationStack);
