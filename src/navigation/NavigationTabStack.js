import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useStore } from '../store/Context';
import OrderCreateScreen from './Modal/OrderCreateScreen';
import HomeScreen from './Home/HomeScreen';
import CatalogScreen from './Catalog/CatalogScreen';
import CatalogViewScreen from './Catalog/CatalogViewScreen';
//import PromoScreen from "./Promo/PromoScreen"
import CartScreen from './Cart/CartScreen';
import ProfileScreen from './Profile/ProfileScreen';
import ProfileMyOrdersScreen from './Profile/ProfileMyOrdersScreen';
import ProfileDataScreen from './Profile/ProfileDataScreen';
import ProfileFavoritesScreen from './Profile/ProfileFavoritesScreen';
import ProfilePromoScreen from './Profile/ProfilePromoScreen';
import CustomIcon from '../component/CustomIcon';
import BrandScreen from './Brand/BrandScreen';
import ProfilePromoViewScreen from './Profile/ProfilePromoViewScreen';
import ProfilePromoShareViewScreen from './Profile/ProfilePromoShareViewScreen';
import ProfileCardsScreen from './Profile/ProfileCardsScreen';
import ProfileServicesScreen from './Profile/ProfileServicesScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CatalogStack = createStackNavigator();
const PromoStack = createStackNavigator();
const CartStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const withHeaderSettings = {
  headerShown: true,
  headerBackTitle: ' ',
  headerTintColor: '#000000',
  headerTintColor: '#20201F',
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#F6F6F6',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    alignText: 'center',
    alignSelf: 'center',
    fontSize: 15,
  },
  headerTitleAlign: 'center',
  fontSize: 15,
  fontWeight: '500',
};

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" options={{ headerShown: false }} component={HomeScreen} />
    <HomeStack.Screen
      name="BrandScreen"
      options={{
        title: ' ',
        headerBackTitle: ' ',
        headerStyle: { backgroundColor: '#fff', borderBottomColor: 'transparent' },
      }}
      component={BrandScreen}
    />
  </HomeStack.Navigator>
);

const CatalogStackScreen = () => (
  <CatalogStack.Navigator>
    <CatalogStack.Group screenOptions={{ headerShown: false }}>
      <CatalogStack.Screen name="CatalogScreen" component={CatalogScreen} />
    </CatalogStack.Group>
    <CatalogStack.Group screenOptions={{ ...withHeaderSettings }}>
      <CatalogStack.Screen
        name="CatalogViewScreen"
        options={{ headerTitle: ' ' }}
        component={CatalogViewScreen}
      />
    </CatalogStack.Group>
  </CatalogStack.Navigator>
);

const PromoStackScreen = () => (
  <PromoStack.Navigator screenOptions={{ headerShown: false }}>
    <PromoStack.Screen name="PromoScreen" component={PromoScreen} />
  </PromoStack.Navigator>
);

const CartStackScreen = () => (
  <CartStack.Navigator screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="CartScreen" component={CartScreen} />
    <CartStack.Screen name="OrderCreateScreen" component={OrderCreateScreen} />
  </CartStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <ProfileStack.Screen
      name="ProfileMyOrdersScreen"
      options={{ ...withHeaderSettings, headerTitle: 'Мои заказы' }}
      component={ProfileMyOrdersScreen}
    />
    <ProfileStack.Screen
      name="ProfileDataScreen"
      options={{ headerShown: false }}
      component={ProfileDataScreen}
    />
    <ProfileStack.Screen
      name="ProfileFavoritesScreen"
      options={{ ...withHeaderSettings, headerTitle: 'Избранное' }}
      component={ProfileFavoritesScreen}
    />
    <ProfileStack.Screen
      name="ProfilePromoScreen"
      options={{ ...withHeaderSettings, headerTitle: 'Бонусы и Промокоды' }}
      component={ProfilePromoScreen}
    />
    <ProfileStack.Screen
      name="ProfilePromoViewScreen"
      options={{ ...withHeaderSettings, headerTitle: ' ' }}
      component={ProfilePromoViewScreen}
    />
    <ProfileStack.Screen
      name="ProfilePromoShareViewScreen"
      options={{ ...withHeaderSettings, headerTitle: 'Пригласить друга' }}
      component={ProfilePromoShareViewScreen}
    />
    <ProfileStack.Screen
      name="ProfileServicesScreen"
      options={{ headerShown: false }}
      component={ProfileServicesScreen}
    />
    <ProfileStack.Screen
      name="ProfileCardsScreen"
      options={{ ...withHeaderSettings, headerTitle: 'Способы оплаты' }}
      component={ProfileCardsScreen}
    />
  </ProfileStack.Navigator>
);

const TabNavigationStack = () => {
  const store = useStore();

  const StackIcon = ({ stack, focused }) => (
    <CustomIcon width={24} height={24} color={focused ? '#2C2C2B' : '#BEBEBD'} icon={stack} />
  );

  return (
    <>
      <StatusBar style="dark" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <StackIcon stack={route.name} focused={focused} />,
          tabBarStyle: { backgroundColor: '#FEFFFE', borderTopWidth: 0 },
          tabBarLabelStyle: { fontWeight: '700' },
          tabBarActiveTintColor: '#2C2C2B',
          tabBarInactiveTintColor: '#9C9C9C',
          tabBarBadgeStyle: { transform: [{ scale: 0.6 }], top: 0, backgroundColor: 'red' },
        })}
      >
        <Tab.Screen
          name="Home"
          options={{ headerShown: false, tabBarLabel: 'Главная' }}
          component={HomeStackScreen}
        />
        <Tab.Screen
          name="Catalog"
          options={{ headerShown: false, tabBarLabel: 'Каталог' }}
          component={CatalogStackScreen}
        />
        {/*<Tab.Screen name="Promo" options={{headerShown: false, tabBarLabel: "Акции"}}
						component={PromoStackScreen}/>*/}
        <Tab.Screen
          name="Cart"
          options={{
            headerShown: false,
            tabBarLabel: 'Корзина',
            tabBarBadge: store.cart.products.length ? ' ' : null,
          }}
          component={CartStackScreen}
        />
        <Tab.Screen
          name="Profile"
          options={{ headerShown: false, tabBarLabel: 'Профиль' }}
          component={ProfileStackScreen}
        />
      </Tab.Navigator>
    </>
  );
};

export default observer(TabNavigationStack);
