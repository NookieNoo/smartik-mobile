import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Image, Platform, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { useStore } from '../../store/Context';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import CopyIcon from '../../assets/svg/icon/CopyIcon';
import ShareIcon from '../../assets/svg/icon/ShareIcon';

const ProfilePromoShareViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const store = useStore();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Пригласить друга',
    });
  }, []);

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
        route.params.item === 'delivery'
          ? 'Привет.\n' +
            'Попробуй доставку «Покупкин».\n' +
            'Воспользуйся бесплатной доставкой по промокоду из этого сообщения.\n' +
            'Просто введи его во время оформления заказа.\n' +
            '\n' +
            'Промокод: ' +
            code +
            '\n' +
            'https://pokupkin.onelink.me/ptNX/54bdovok'
          : 'Привет.\n' +
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
        console.log(res);
      })
      .catch((err) => {});
  };

  return (
    <>
      <PromoWrapper>
        <ScanQR>Отсканируйте QR-код, чтобы скачать приложение</ScanQR>
        <QrWrapper>
          <Image
            style={{ width: 200, height: 200 }}
            source={require('../../assets/png/qr-download.png')}
          />
        </QrWrapper>

        <Description>
          {route.params.item === 'delivery'
            ? 'Поделись с друзьями промо-кодом и получи Бесплатную доставку, и друзья получат Бесплатную доставку на свой первый заказ.'
            : 'Поделись с друзьями промо-кодом и получи скидку в 300₽ на свой заказ, а друзья получат скидку в 300₽ на свой первый заказ.'}
        </Description>

        <Code>{store.user.personal_promocodes[route.params.item]}</Code>
      </PromoWrapper>

      <ButtonWrapper>
        <CopyButton
          onPress={() => copyToClipboard(store.user.personal_promocodes[route.params.item])}
          style={{ marginRight: 12, flexDirection: 'row' }}
        >
          <CopyIcon />
          <ButtonTitle>Скопировать</ButtonTitle>
        </CopyButton>
        <ShareButton
          onPress={() => share(store.user.personal_promocodes[route.params.item])}
          style={{ marginLeft: 12, flexDirection: 'row' }}
        >
          <ShareIcon />
          <ButtonTitle style={{ color: 'white' }}>Поделиться</ButtonTitle>
        </ShareButton>
      </ButtonWrapper>
    </>
  );
};

export default observer(ProfilePromoShareViewScreen);

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
  margin-left: 5px;
`;
