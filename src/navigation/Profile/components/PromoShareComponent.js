import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import { useStore } from '../../../store/Context';
import ShareIcon from '../../../assets/svg/icon/ShareIcon';
import CopyIcon from '../../../assets/svg/icon/CopyIcon';

const PromoShareComponent = ({ orderScreen = false }) => {
  const navigation = useNavigation();
  const store = useStore();

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
        console.log(res);
      })
      .catch((err) => {});
  };

  return (
    <>
      {!orderScreen && <TitleText>Промокод для друзей</TitleText>}
      <PromoWrapper>
        <ScanQR>Отсканируйте QR-код, чтобы скачать приложение</ScanQR>
        <QrWrapper>
          <Image
            style={{ width: 105, height: 105 }}
            source={require('../../../assets/png/qr-download.png')}
          />
        </QrWrapper>

        <Description>
          Поделись с друзьями промокодом. {'\n'}Друзья получат{' '}
          <PurpleDescription> скидку в 300₽</PurpleDescription> на свой первый заказ, а ты получишь
          <PurpleDescription> скидку в 300₽</PurpleDescription> на каждый следующий заказ
        </Description>

        <Code>{store.user.personal_promocodes['money']}</Code>
      </PromoWrapper>

      <ButtonWrapper>
        <CopyButton
          onPress={() => copyToClipboard(store.user.personal_promocodes['money'])}
          style={{ marginRight: 12 }}
        >
          <CopyIcon />
          <ButtonTitle>Скопировать</ButtonTitle>
        </CopyButton>
        <ShareButton
          onPress={() => share(store.user.personal_promocodes['money'])}
          style={{ marginLeft: 12 }}
        >
          <ShareIcon />
          <ButtonTitle style={{ color: 'white' }}>Поделиться</ButtonTitle>
        </ShareButton>
      </ButtonWrapper>

      <RulesButton
        onPress={() =>
          navigation.navigate('ModalNavigation', {
            screen: 'StoriesScreen',
          })
        }
        orderScreen={orderScreen}
      >
        <RulesButtonText>Условия и правила программы</RulesButtonText>
      </RulesButton>
    </>
  );
};

export default observer(PromoShareComponent);

const TitleText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  align-self: center;
  color: #979797;
  margin-top: 10px;
`;
const PromoWrapper = styled.View`
  margin: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 20px;
`;
const QrWrapper = styled.View`
  width: 105px;
  height: 105px;
  align-self: center;
  align-items: center;
`;
const Description = styled.Text`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
`;
const PurpleDescription = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #8356ce;
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
  flex-direction: row;
`;
const ShareButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #7b4ede;
  border-radius: 8px;
  flex-direction: row;
`;
const ButtonTitle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  margin-left: 4px;
`;
const RulesButton = styled(TouchableOpacity)`
  background-color: #e3e3e3;
  border-radius: 8px;
  align-self: center;
  margin-top: ${(props) => (!props.orderScreen ? '70px' : '30px')};
`;
const RulesButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  padding-horizontal: 18px;
  padding-vertical: 14px;
`;
