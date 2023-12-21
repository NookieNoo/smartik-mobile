import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Platform, Text } from 'react-native';
import styled from 'styled-components';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import CopyIcon from '../../assets/svg/icon/CopyIcon';
import dayjs from 'dayjs';

const ProfilePromoViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const { promo, index } = route.params;

  useEffect(() => {
    console.log(route.params);
    navigation.setOptions({
      headerTitle: promo.name,
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

  return (
    <>
      <IndexText>Промокод №{index}</IndexText>
      <PromoWrapper onPress={() => copyToClipboard(promo.code)}>
        <StatusView>
          <StatusCircle active={promo.active} />
          <StatusText active={promo.active}>{promo.active ? 'Активный' : 'Неактивный'}</StatusText>
        </StatusView>
        <DescriptionText>
          Промокод на <PurpleDescriptionText>скидку в {promo.discount}₽</PurpleDescriptionText> на
          следующий заказ от {promo.from_sum}₽ 👌
        </DescriptionText>
        <NameView>
          <Name>{promo.code}</Name>
          <CopyIcon color="#8356CE" width="17" height="19" />
        </NameView>
        {promo.ended_at && (
          <ValidLine>
            <ValidText>Действителен до:</ValidText>
            <ValidText>{dayjs(promo.ended_at).format('DD.MM.YYYY')}</ValidText>
          </ValidLine>
        )}
      </PromoWrapper>
    </>
  );
};

export default observer(ProfilePromoViewScreen);

const PromoWrapper = styled.TouchableOpacity`
  margin: 25px;
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 20px;
`;
const NameView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
`;
const Name = styled.Text`
  font-weight: 700;
  color: #8356ce;
  font-size: 30px;
  letter-spacing: -0.53px;
  margin-right: 18px;
`;
const ValidLine = styled.View`
  flex-direction: row;
  margin-top: 6px;
  justify-content: space-between;
`;
const ValidText = styled.Text`
  color: #2c2c2b;
  font-size: 10px;
  font-weight: 400;
`;
const StatusView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const StatusCircle = styled.View`
  height: 7px;
  width: 7px;
  border-radius: 3.5px;
  background-color: ${(props) => (props.active ? '#38B54D' : '#FF3B30')};
`;
const StatusText = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: ${(props) => (props.active ? '#38B54D' : '#FF3B30')};
  margin-left: 4px;
`;
const DescriptionText = styled.Text`
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.71px;
  margin-top: 6px;
`;
const PurpleDescriptionText = styled.Text`
  font-weight: 700;
  color: #8356ce;
`;
const IndexText = styled.Text`
  color: #979797;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.08px;
  align-self: center;
  margin-top: 15px;
`;
