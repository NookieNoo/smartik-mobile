import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/Context';
import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';
import { Image, Platform, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import config from '../../config';
import CopyIcon from '../../assets/svg/icon/CopyIcon';
import ShareIcon from '../../assets/svg/icon/ShareIcon';
import CancelIcon from '../../assets/svg/icon/CancelIcon';
import ArrowLeftIcon from '../../assets/svg/icon/ArrowLeftIcon';
import AppLogoIcon from '../../assets/svg/icon/AppLogoIcon';

const OrderPayScreen = ({ route }) => {
  const navigation = useNavigation();
  const store = useStore();
  const { uri, name } = route.params;

  const [status, setStatus] = useState('start');

  const webViewRef = useRef(null);
  const canGoBackRef = useRef(false);

  useEffect(() => {
    store.app.setAnalyticEvent('page_order_pay');
  }, []);

  useEffect(() => {
    if (status === 'success') {
      navigation.setOptions({ headerTitle: 'Оплачен заказ № ' + name });
      store.app.setAnalyticEvent('page_order_pay_success', {
        af_order_id: name,
        monetary: store.cart.sum_final.toFixed(2),
        af_revenue: store.cart.sum_final.toFixed(2),
        orderId: name,
        actiion_id: name,
      });
    }
    if (status !== 'start') navigation.setOptions({ headerLeft: () => null });
  }, [status]);

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

  const share = (code) => {
    Share.open({
      message:
        'Привет.\n' +
        'Попробуй доставку «Покупкин».\n' +
        'Воспользуйся скидкой на первый заказ по промокоду из этого сообщения.\n' +
        'Просто введи его во время оформления заказа.\n' +
        '\n' +
        'Промокод: ' +
        code +
        '\n' +
        'https://pokupkin.onelink.me/ptNX/rdyrqefm',
    })
      .then((res) => {
        //console.log(res)
      })
      .catch((err) => {});
  };

  const goPrevPage = () => {
    if (canGoBackRef.current) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
  };

  if (!uri) return null;

  return (
    <Wrapper>
      <PayHeader>
        <FlexWrapper>
          {status === 'start' && (
            <PageBackButton onPress={goPrevPage}>
              <ArrowLeftIcon />
            </PageBackButton>
          )}
        </FlexWrapper>
        <FlexWrapper>
          <PayTitle>Оплата Заказа</PayTitle>
        </FlexWrapper>

        <FlexWrapper />
      </PayHeader>
      {status === 'start' ? (
        <PayView
          ref={webViewRef}
          onNavigationStateChange={(state) => {
            canGoBackRef.current = state.canGoBack;
            const { url } = state;
            if (url.indexOf(config.axios.baseURL + '/payment/error') !== -1) setStatus('error');
            if (url.indexOf(config.axios.baseURL + '/payment/success') !== -1) setStatus('success');
          }}
          source={{ uri }}
        />
      ) : status === 'success' ? (
        <>
          <TitleView>
            <AppLogoIcon />
            <ThxText>Спасибо за заказ!</ThxText>
          </TitleView>

          <PromoWrapper>
            <ScanQR>Отсканируйте QR-код, чтобы скачать приложение</ScanQR>
            <QrWrapper>
              <Image
                style={{ width: 200, height: 200 }}
                source={require('../../assets/png/qr-download.png')}
              />
            </QrWrapper>

            <Description>
              Поделись с друзьями промо-кодом и получи скидку в 300₽ на свой заказ, а друзья получат
              скидку в 300₽ на свой первый заказ.
            </Description>

            <Code>{store.user.personal_promocodes['money']}</Code>
          </PromoWrapper>

          <ButtonWrapper>
            <CopyButton
              onPress={() => copyToClipboard(store.user.personal_promocodes['money'])}
              style={{ marginRight: 12, flexDirection: 'row' }}
            >
              <CopyIcon />
              <ButtonTitle>Скопировать</ButtonTitle>
            </CopyButton>
            <ShareButton
              onPress={() => share(store.user.personal_promocodes['money'])}
              style={{ marginLeft: 12, flexDirection: 'row' }}
            >
              <ShareIcon />
              <ButtonTitle style={{ color: 'white' }}>Поделиться</ButtonTitle>
            </ShareButton>
          </ButtonWrapper>
        </>
      ) : status === 'error' ? (
        <Result>
          <CancelIcon size="140" />
          <ResultMessage>Неудачная оплата</ResultMessage>
        </Result>
      ) : null}

      {status !== 'start' ? (
        <PaymentWrapper>
          <PaymentButton
            onPress={async () => {
              if (status === 'success') {
                navigation.popToTop();
                navigation.goBack();
                store.user.auth();
                setTimeout(() => {
                  navigation.replace('TabNavigation');
                }, 200);
              } else {
                navigation.goBack();
              }
            }}
          >
            <PaymentButtonText>
              {status === 'success' ? 'Закрыть' : 'Вернуться к оплате'}
            </PaymentButtonText>
          </PaymentButton>
        </PaymentWrapper>
      ) : null}
    </Wrapper>
  );
};

export default observer(OrderPayScreen);

const Wrapper = styled.View`
  flex: 1;
`;
const Result = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const ResultMessage = styled.Text`
  margin-top: 40px;
  font-size: 25px;
`;
const PayView = styled(WebView)`
  flex: 1;
`;
const PayHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`;
const PayTitle = styled.Text`
  align-self: center;
  font-size: 15px;
  font-weight: 500;
  color: #000;
`;
const FlexWrapper = styled.View`
  flex: 1;
`;
const PageBackButton = styled.TouchableOpacity`
  margin-left: 14px;
  align-self: flex-start;
  padding: 5px;
`;
const PaymentWrapper = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 10px 15px 50px;
`;
const PaymentButtonText = styled.Text`
  font-weight: 500;
  color: #fff;
  font-size: 17px;
`;
const PaymentButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #7b4ede;
  height: 50px;
  border-radius: 14px;
`;
const PromoWrapper = styled.View`
  margin: 25px;
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 20px;
`;
const QrWrapper = styled.View`
  width: 200px;
  height: 200px;
  align-self: center;
  align-items: center;
`;
const Description = styled.Text`
  margin-top: 16px;
  font-size: 14px;
`;
const Code = styled.Text`
  margin-top: 10px;
  font-weight: bold;
  color: #8356ce;
  font-size: 40px;
`;
const ScanQR = styled.Text`
  color: #979797;
  font-size: 10px;
  text-align: center;
  margin-bottom: 10px;
`;
const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 0 25px;
`;
const CopyButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #e3e3e3;
  border-radius: 8px;
`;
const ShareButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #7b4ede;
  border-radius: 8px;
`;
const ButtonTitle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  margin-left: 6px;
`;
const ThxText = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  align-self: center;
`;
const TitleView = styled.View`
  flex-direction: row;
  align-self: center;
`;
