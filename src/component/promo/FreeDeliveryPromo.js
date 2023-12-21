import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';

const FreeDeliveryPromo = () => {
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
    <Wrapper>
      <WrapperContent>
        <PromoImage
          source={require('../../assets/png/promoStories/free-delivery-promo.png')}
          resizeMode="contain"
        />
        <TextView>
          <Title>Промокод {`\n`}на бесплатную доставку</Title>
          <Subtitle>
            Бесплатная доставка — это всегда приятно! Дарим вам промокод на бесплатную доставку.
            {`\n\n`}Как воспользоваться - введите промокод при оформлении заказа{' '}
            <PromoText>«ME655»</PromoText>
            {`\n\n`}
            Воспользуйтесь уже сейчас и получите любимые товары по выгодной цене с бесплатной
            доставкой уже на следующий день!{`\n\n`}Срок действия предложения до 31.12.2023 Промокод
            активирует одну бесплатную доставку при минимальном заказе от 500₽
          </Subtitle>
          <Button onPress={() => copyToClipboard('ME655')}>
            <ButtonText>Воспользуюсь промокодом</ButtonText>
          </Button>
        </TextView>
      </WrapperContent>
    </Wrapper>
  );
};

export default observer(FreeDeliveryPromo);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #d2c4b2;
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
  width: ${Dimensions.get('screen').width - 50}px;
  height: 35%;
  margin-top: 5px;
  align-self: center;
`;
const TextView = styled.View`
  margin-horizontal: 25px;
`;
const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  margin-top: 25px;
  color: #2c2c2b;
  line-height: 28px;
`;
const Subtitle = styled.Text`
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
  color: #2c2c2b;
`;
const PromoText = styled.Text`
  font-weight: 700;
  font-size: 12px;
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
  color: #ffffff;
`;
