import { observer } from 'mobx-react-lite';
import React from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const AddressZonePromo = ({ press }) => {
  return (
    <Wrapper>
      <WrapperContent>
        <PromoImage
          source={require('../../assets/png/promoStories/address-zone-promo.png')}
          resizeMode="contain"
        />
        <TextView>
          <Title>Расширили{`\n`}зону доставки</Title>
          <Subtitle>
            Теперь Покупкин доставляет продукты не только по Москве, но и за ее пределами.{`\n\n`}
            Чтобы посмотреть доступность адреса, просто нажмите на адрес вверху экрана и укажите
            свой адрес, интерактивная карта подскажет, осуществляем ли мы доставку в этом районе.
            {`\n\n`}Если вашего адреса не оказалось на карте, позвоните или напишите нам,
            мы обязательно решим эту проблему!
          </Subtitle>
          <Cities>
            Щербинка, Люберцы, Коммунарка, Марьино, Внуково, Одинцово, Барвиха, Красногорск, Митино,
            Химки, Долгопрудный, Мытищи, Румянцево и другие.
          </Cities>
          <Button onPress={() => press()}>
            <ButtonText>Посмотреть карту</ButtonText>
          </Button>
        </TextView>
      </WrapperContent>
    </Wrapper>
  );
};

export default observer(AddressZonePromo);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #8356ce;
  justify-content: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const WrapperContent = styled(View)`
  flex: 1;
  justify-content: space-between;
  margin-vertical: 45px;
`;
const PromoImage = styled.Image`
  width: ${Dimensions.get('screen').width - 50}px
  height: 30%;
  align-self: center;
  margin-horizontal: 25px;
  margin-top: 10px
`;
const TextView = styled.View`
  margin-horizontal: 25px;
`;
const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  line-height: 28px;
`;
const Subtitle = styled.Text`
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
  color: #ffffff;
`;
const Cities = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  margin-top: 10px;
`;
const Button = styled.TouchableOpacity`
  background-color: #fcb650;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 20px;
`;
const ButtonText = styled.Text`
  padding-horizontal: 30px;
  padding-vertical: 19px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
`;
