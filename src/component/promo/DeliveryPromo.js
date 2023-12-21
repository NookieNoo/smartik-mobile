import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const DeliveryPromo = ({ press }) => {
  return (
    <Wrapper>
      <WrapperContent>
        <PromoImage
          source={require('../../assets/png/promoStories/delivery-promo.png')}
          resizeMode="contain"
        />

        <TextView>
          <Title>Доставка{`\n`}на следующий день!</Title>
          <Subtitle>
            Теперь при заказе до 00:00 мы доставим ваш заказ уже на следующий день! {`\n\n`}Продукты
            по суперцене стали ближе, выбирай товары из любого раздела в каталоге и получи
            их с доставкой на следующий день. Курьер обязательно позвонит, а push-уведомление
            предупредит о том, когда курьер будет выезжать к вам на адрес.
          </Subtitle>
          <Button onPress={() => press()}>
            <ButtonText>Отлично</ButtonText>
          </Button>
        </TextView>
      </WrapperContent>
    </Wrapper>
  );
};

export default observer(DeliveryPromo);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #fcb650;
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
  width: 100%;
  height: 35%;
  margin-top: 30px;
`;
const TextView = styled.View`
  margin-horizontal: 25px;
  align-content: space-between;
`;
const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  margin-top: 25px;
  line-height: 28px;
`;
const Subtitle = styled.Text`
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
`;
const Button = styled.TouchableOpacity`
  background-color: #8356ce;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 20px;
`;
const ButtonText = styled.Text`
  padding-horizontal: 30px;
  padding-vertical: 19px;
  font-size: 14px;
  font-weight: 500;
  color: #f8f7f5;
`;
