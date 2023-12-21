import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, RefreshControl, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';
import MinimumOrderSum from '../../component/MimimumOrderSum';
import { useStore } from '../../store/Context';
import HomePromo from './component/HomePromo';
import HomeCategories from './component/HomeCategories';
import { useNavigation } from '@react-navigation/native';
import AddressSearchView from '../../component/template/AddressSearchView';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import HomeBanner from './component/HomeBanner';
import MoveUpIcon from '../../assets/svg/icon/MoveUpIcon';
import AllProducts from '../../component/AllProducts';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import WantBanner from './component/modalBanners/WantBanner';
import SuperBanner from './component/modalBanners/SuperBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const HomeScreen = ({ route }) => {
  const store = useStore();
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [banner, setBanner] = useState(null);
  const [upButton, setUpButton] = useState(false);

  const listRef = useRef();
  const [triggerMore, setTriggerMore] = useState(false);

  useEffect(() => {
    if (route.params?.move === 'Promo') {
      navigation.push('TabNavigation', {
        screen: 'Profile',
        params: { screen: 'ProfilePromoScreen', params: { initial: 'myPromo' } },
      });
    }
  }, []);

  useEffect(() => {
    store.homeCategories.fetchAll();
    loadOrdersNumber();
    store.app.setAnalyticEvent('page_home');
  }, []);

  const loadOrdersNumber = async () => {
    if (!store.user.phone || store.app.landing || store.user.media_source === 'CPA-Getblogger') {
      return;
    }

    const firstTime = await AsyncStorage.getItem('firstTime');
    const completedOrders = store.user.hasCompletedOrdersNumber;

    if (!firstTime) {
      if (completedOrders === 0) {
        setShowModal(true);
        setBanner(<WantBanner close={() => setShowModal(false)} copyCode={moveToPromo} />);
      } else if (completedOrders === 1) {
        setShowModal(true);
        setBanner(
          <SuperBanner
            close={() => setShowModal(false)}
            copyCode={(code) => copyToClipboard(code)}
          />
        );
      }

      await AsyncStorage.setItem('lastShown', dayjs().toISOString());
      await AsyncStorage.setItem(
        'firstTime',
        JSON.stringify({
          date: dayjs().toISOString(),
          type: completedOrders === 0 ? 'want' : 'super',
        })
      );
    } else {
      const parsedFirst = JSON.parse(firstTime);

      if (dayjs().diff(parsedFirst.date, 'days') < 8) {
        const lastTime = await AsyncStorage.getItem('lastShown');
        if (completedOrders === 0) {
          setShowModal(true);
          setBanner(<WantBanner close={() => setShowModal(false)} copyCode={moveToPromo} />);
        } else if (completedOrders === 1) {
          if (dayjs().startOf('day').diff(dayjs(lastTime).startOf('day'), 'days') >= 1) {
            setShowModal(true);
            setBanner(
              <SuperBanner
                close={() => setShowModal(false)}
                copyCode={(code) => copyToClipboard(code)}
              />
            );

            await AsyncStorage.setItem('lastShown', dayjs().toISOString());
          }
        }
      }
    }
  };

  const moveToPromo = () => {
    setShowModal(false);
    setBanner(null);
    navigation.push('TabNavigation', {
      screen: 'Profile',
      params: { screen: 'ProfilePromoScreen', params: { initial: 'myPromo' } },
    });
  };

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
    showMessage({
      message: 'Код скопирован',
      style: {
        marginBottom: Platform.OS === 'ios' ? -15 : 0,
      },
      icon: 'success',
      duration: 1200,
      position: 'top',
      statusBarHeight: 40,
    });
  };

  const moveToUp = () => {
    setUpButton(false);
    listRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const calculateBottom = () => {
    if (store.cart.products.length === 0) {
      return 10;
    }

    return 120;
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 100;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <Wrapper style={{ flex: 1, paddingTop: 50 }}>
      <StatusBar style={'dark'} />
      <AddressSearchView />
      <ScrollView
        ref={listRef}
        onScroll={(e) => {
          if (isCloseToBottom(e.nativeEvent)) {
            setTriggerMore(!triggerMore);
          }
          if (e.nativeEvent.contentOffset.y < 5) {
            setUpButton(false);
          } else if (e.nativeEvent.contentOffset.y > 300) {
            setUpButton(true);
          }
        }}
        scrollEventThrottle={0}
        refreshControl={
          <RefreshControl
            onRefresh={() => store.homeCategories.fetchAll()}
            refreshing={store.homeCategories.loading}
          />
        }
      >
        <HomeBanner />
        <HomePromo />
        <HomeCategories />
        <AllProducts trigger={triggerMore} setTrigger={() => setTriggerMore(false)} />
      </ScrollView>

      {upButton && (
        <UpButton onPress={moveToUp} bottom={calculateBottom()}>
          <MoveUpIcon height="21" width="17" />
        </UpButton>
      )}
      <MinimumOrderSum />
      {store.layout.modalShown && (
        <Animated.View
          style={{
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
          }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}
      {showModal && (
        <Animated.View
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('screen').width,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
          }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <Modal
            animationType="slide"
            visible={showModal}
            transparent={true}
            onRequestClose={() => {
              setShowModal(!showModal);
              setBanner(null);
            }}
          >
            <ModalView>{banner}</ModalView>
            <BlackBottom />
          </Modal>
        </Animated.View>
      )}
    </Wrapper>
  );
};

export default observer(HomeScreen);

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: #f7f7f7;
`;
const ModalView = styled.SafeAreaView`
  flex: 1;
  background-color: transparent;
  justify-content: flex-end;
  z-index: 1;
`;
const BlackBottom = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`;
const UpButton = styled.TouchableOpacity`
  height: 44px;
  width: 44px;
  border-radius: 22px;
  background-color: #8356ce;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: ${(props) => props.bottom}px;
  left: 15px;
  z-index: 10;
`;
